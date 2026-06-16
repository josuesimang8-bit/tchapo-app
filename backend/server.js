import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir o frontend estático do Tchapo Tchapo
app.use(express.static(path.join(__dirname, 'tchapo-tchapo')));

// Configurar multer para upload das fotos dos motoristas
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads/drivers');
        if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads'));
        }
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Configurar multer para upload das fotos dos produtos
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads/products');
        if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads'));
        }
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const uploadProduct = multer({ storage: productStorage });

// Servir ficheiros carregados de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const supabaseUrl = process.env.SUPABASE_URL || 'https://rkempjcqoefhdthvwewm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

function formatOrderResponse(order) {
    if (!order) return order;
    let itemsArray = [];
    if (order.items) {
        try {
            itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        } catch (e) {
            itemsArray = [];
        }
    }
    const normalizedItems = Array.isArray(itemsArray) ? itemsArray.map(item => ({
        product_name: item.product_name || item.name || 'Produto',
        quantity: item.quantity || 1,
        price: item.price || 0
    })) : [];

    return {
        ...order,
        items: normalizedItems,
        order_items: normalizedItems
    };
}

// GET orders
app.get('/api/orders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, drivers(*)')
            .order('created_at', { ascending: false });
        
        if (error) {
            if (error.message.includes('drivers') || error.message.includes('relationship')) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (fallbackError) throw fallbackError;
                return res.json(fallbackData.map(formatOrderResponse));
            }
            throw error;
        }
        res.json(data.map(formatOrderResponse));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET user orders
app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('orders')
            .select('*, drivers(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
        if (error) {
            if (error.message.includes('drivers') || error.message.includes('relationship')) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });
                if (fallbackError) throw fallbackError;
                return res.json(fallbackData.map(formatOrderResponse));
            }
            throw error;
        }
        res.json(data.map(formatOrderResponse));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new order
app.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, phone, bairro, address, time, payment, total, items, user_id, referral_code, referral_discount } = req.body;
        
        let finalReferralCode = referral_code || null;
        let finalReferralDiscount = referral_discount ? Number(referral_discount) : 0.00;
        let finalTotal = total;

        if (user_id && finalReferralCode) {
            // Verify if user already has non-cancelled orders
            const { data: userOrders, error: ordersError } = await supabase
                .from('orders')
                .select('id')
                .eq('user_id', user_id)
                .neq('status', 'Cancelado')
                .limit(1);
                
            if (ordersError) throw ordersError;
            
            if (userOrders && userOrders.length > 0) {
                // Not eligible for referral discount on subsequent orders
                // Clear the discount and restore the original total
                finalReferralCode = null;
                if (finalReferralDiscount > 0) {
                    finalTotal += finalReferralDiscount;
                    finalReferralDiscount = 0.00;
                }
            }
        }

        let order;
        // Try inserting with items column (directly saving products array)
        const { data: dataWithItems, error: errorWithItems } = await supabase
            .from('orders')
            .insert([{ 
                customer_name, phone, bairro, address, time, payment, total: finalTotal, status: 'Processando', user_id: user_id || null,
                items: items || [],
                referral_code: finalReferralCode,
                referral_discount: finalReferralDiscount
            }])
            .select()
            .single();

        if (errorWithItems) {
            // Fallback: If "items" column doesn't exist yet, insert without it
            if (errorWithItems.message.includes('column') || errorWithItems.message.includes('items')) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('orders')
                    .insert([{ 
                        customer_name, phone, bairro, address, time, payment, total: finalTotal, status: 'Processando', user_id: user_id || null,
                        referral_code: finalReferralCode,
                        referral_discount: finalReferralDiscount
                    }])
                    .select()
                    .single();
                if (fallbackError) throw fallbackError;
                order = fallbackData;
            } else {
                throw errorWithItems;
            }
        } else {
            order = dataWithItems;
        }

        res.status(201).json(formatOrderResponse(order));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single order by ID (for real-time tracking polling)
app.get('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orders')
            .select('*, drivers(*)')
            .eq('id', id)
            .single();
            
        if (error) {
            if (error.message.includes('drivers') || error.message.includes('relationship')) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (fallbackError) throw fallbackError;
                return res.json(formatOrderResponse(fallbackData));
            }
            throw error;
        }
        res.json(formatOrderResponse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function processReferralCommission(order) {
    try {
        const orderId = order.id;
        const code = order.referral_code;
        if (!code) return;
        
        // 1. Check if this order has already been credited in referral_transactions
        const { data: existingTx, error: txError } = await supabase
            .from('referral_transactions')
            .select('id')
            .eq('order_id', orderId)
            .limit(1);
            
        if (txError) {
            console.error('Error checking existing referral transaction:', txError);
            return;
        }
        
        if (existingTx && existingTx.length > 0) {
            console.log(`Referral commission for order #${orderId} already processed.`);
            return;
        }
        
        // 2. Find the referrer by referral code
        const { data: referrer, error: refError } = await supabase
            .from('referrals')
            .select('*')
            .eq('code', code.trim().toUpperCase())
            .maybeSingle();
            
        if (refError || !referrer) {
            console.error(`Referrer not found for code "${code}":`, refError);
            return;
        }
        
        // Prevent self-referral
        if (referrer.user_id === order.user_id) {
            console.log('Self-referral detected. Skipping commission.');
            return;
        }
        
        // 3. Count how many previous transactions this referrer has completed
        const { data: prevTxs, count, error: countError } = await supabase
            .from('referral_transactions')
            .select('id', { count: 'exact', head: true })
            .eq('referrer_id', referrer.user_id);
            
        if (countError) {
            console.error('Error counting previous transactions:', countError);
            return;
        }
        
        // 4. Calculate commission amount: 50 MT if first, 20 MT if subsequent
        const commissionAmount = (count === 0) ? 50.00 : 20.00;
        
        // 5. Insert transaction
        const { error: insertTxError } = await supabase
            .from('referral_transactions')
            .insert([{
                referrer_id: referrer.user_id,
                order_id: orderId,
                amount: commissionAmount,
                buyer_name: order.customer_name,
                order_total: order.total
            }]);
            
        if (insertTxError) {
            console.error('Error inserting referral transaction:', insertTxError);
            return;
        }
        
        // 6. Update referrer's balance, total_earned
        const newBalance = Number(referrer.balance) + commissionAmount;
        const newTotalEarned = Number(referrer.total_earned) + commissionAmount;
        
        const { error: updateRefError } = await supabase
            .from('referrals')
            .update({
                balance: newBalance,
                total_earned: newTotalEarned
            })
            .eq('id', referrer.id);
            
        if (updateRefError) {
            console.error('Error updating referrer balance:', updateRefError);
        } else {
            console.log(`Successfully credited ${commissionAmount} MT to user ${referrer.user_name} (${referrer.user_email}) for order #${orderId}`);
        }
    } catch (err) {
        console.error('Failed to process referral commission:', err);
    }
}

// PUT update status and/or driver
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, driver_id } = req.body;
        
        const updates = {};
        if (status !== undefined) updates.status = status;
        if (driver_id !== undefined) updates.driver_id = driver_id;
        
        const { data, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // If marked as Entregue, process referral earnings
        if (status === 'Entregue' && data && data.referral_code) {
            console.log(`Order #${id} marked as Entregue. Processing referral code: ${data.referral_code}`);
            await processReferralCommission(data);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── DRIVERS ENDPOINTS ────────────────────────────────────────────────
// GET all drivers
app.get('/api/drivers', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('drivers')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function uploadToSupabaseStorage(bucketName, file) {
    try {
        const fileBuffer = fs.readFileSync(file.path);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(file.filename, fileBuffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) {
            console.error(`Supabase storage upload error to ${bucketName}:`, error);
            return null;
        }
        
        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(file.filename);
            
        // Delete local temp file
        try {
            fs.unlinkSync(file.path);
        } catch (e) {
            console.error('Failed to delete temp file:', e);
        }
        
        return publicUrlData.publicUrl;
    } catch (err) {
        console.error(`Failed to upload to Supabase storage ${bucketName}:`, err);
        return null;
    }
}

async function uploadToCatbox(file) {
    try {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        
        const fileBuffer = fs.readFileSync(file.path);
        const blob = new Blob([fileBuffer], { type: file.mimetype });
        formData.append('fileToUpload', blob, file.filename);

        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error(`Catbox upload HTTP error for ${file.filename}:`, response.statusText);
            return null;
        }

        const text = await response.text();
        const url = text.trim();
        
        // Delete local temp file since we uploaded it successfully
        try {
            fs.unlinkSync(file.path);
        } catch (e) {
            console.error('Failed to delete temp file after Catbox upload:', e);
        }
        
        if (url && url.startsWith('http')) {
            return url;
        }
        return null;
    } catch (err) {
        console.error(`Failed to upload to Catbox ${file.filename}:`, err);
        return null;
    }
}

// POST new driver
app.post('/api/drivers', async (req, res) => {
    try {
        const { name, phone, photo_url } = req.body;
        const { data, error } = await supabase
            .from('drivers')
            .insert([{ name, phone, photo_url, active: true }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST upload photo for driver
app.post('/api/drivers/upload', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum ficheiro enviado.' });
    }
    
    let publicUrl = await uploadToSupabaseStorage('drivers', req.file);
    
    if (!publicUrl) {
        console.log('Supabase storage failed for driver photo, using Catbox fallback...');
        publicUrl = await uploadToCatbox(req.file);
    }
    
    if (publicUrl) {
        res.json({ photo_url: publicUrl });
    } else {
        // Fallback to local file
        const photoUrl = `/uploads/drivers/${req.file.filename}`;
        res.json({ photo_url: photoUrl });
    }
});

// PUT update driver
app.put('/api/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, photo_url, active } = req.body;
        
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (photo_url !== undefined) updates.photo_url = photo_url;
        if (active !== undefined) updates.active = active;
        
        const { data, error } = await supabase
            .from('drivers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE driver
app.delete('/api/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('drivers').delete().eq('id', id);
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── PRODUCTS ENDPOINTS ────────────────────────────────────────────────
// Helper to resolve product image URLs dynamically to the backend host origin
function fixImageUrls(req, products) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    const arrayProducts = Array.isArray(products) ? products : [products];
    const resolved = arrayProducts.map(p => {
        if (!p || !p.image) return p;
        let img = p.image;
        // If it starts with localhost or is a relative path, resolve it using the current request's baseUrl
        if (img.startsWith('http://localhost:3000') || img.startsWith('http://localhost:5173') || !img.startsWith('http')) {
            const cleanPath = img.replace(/^https?:\/\/localhost:\d+/, '');
            const relativePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
            img = `${baseUrl}${relativePath}`;
        }
        return {
            ...p,
            image: img
        };
    });
    return Array.isArray(products) ? resolved : resolved[0];
}

// GET active products (storefront)
function getClicks(product) {
    if (!product || !product.features || !Array.isArray(product.features)) return 0;
    const flag = product.features.find(f => f.startsWith('_clicks:'));
    if (flag) {
        const val = parseInt(flag.split(':')[1], 10);
        return isNaN(val) ? 0 : val;
    }
    return 0;
}

// GET active products (storefront) - Sorted by clicks descending
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true);
        
        if (error) {
            console.error('Erro ao ler produtos do Supabase:', error.message);
            return res.json([]);
        }

        // Sort by clicks descending, fallback to ID descending
        const sorted = data.sort((a, b) => {
            const clicksA = getClicks(a);
            const clicksB = getClicks(b);
            if (clicksA !== clicksB) {
                return clicksB - clicksA;
            }
            return b.id - a.id;
        });
        
        res.json(fixImageUrls(req, sorted));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST increment click count for product
app.post('/api/products/:id/click', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('features')
            .eq('id', id)
            .single();
            
        if (fetchError) throw fetchError;
        
        let features = product.features || [];
        if (!Array.isArray(features)) {
            features = [];
        }
        
        const clickIndex = features.findIndex(f => f.startsWith('_clicks:'));
        if (clickIndex !== -1) {
            const currentClicks = parseInt(features[clickIndex].split(':')[1], 10) || 0;
            features[clickIndex] = `_clicks:${currentClicks + 1}`;
        } else {
            features.push(`_clicks:1`);
        }
        
        const { error: updateError } = await supabase
            .from('products')
            .update({ features })
            .eq('id', id);
            
        if (updateError) throw updateError;
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all products (admin dashboard)
app.get('/api/products/admin', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });
        
        if (error) throw error;
        res.json(fixImageUrls(req, data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, category, image, desc, features, active } = req.body;
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name,
                price: Number(price),
                category,
                image: image || 'assets/default_product.png',
                desc,
                features: Array.isArray(features) ? features : [],
                active: active !== undefined ? active : true
            }])
            .select()
            .single();
        
        if (error) throw error;
        res.status(201).json(fixImageUrls(req, data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST upload photo for product
app.post('/api/products/upload', uploadProduct.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum ficheiro enviado.' });
    }
    
    let publicUrl = await uploadToSupabaseStorage('products', req.file);
    
    if (!publicUrl) {
        console.log('Supabase storage failed for product photo, using Catbox fallback...');
        publicUrl = await uploadToCatbox(req.file);
    }
    
    if (publicUrl) {
        res.json({ photo_url: publicUrl });
    } else {
        // Fallback to local file
        const photoUrl = `/uploads/products/${req.file.filename}`;
        res.json({ photo_url: photoUrl });
    }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, desc, features, active } = req.body;
        
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (price !== undefined) updates.price = Number(price);
        if (category !== undefined) updates.category = category;
        if (image !== undefined) updates.image = image;
        if (desc !== undefined) updates.desc = desc;
        if (features !== undefined) updates.features = Array.isArray(features) ? features : [];
        if (active !== undefined) updates.active = active;
        
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
            
        if (error) throw error;
        res.json(fixImageUrls(req, data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET PDF
app.get('/api/orders/:id/pdf', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        const order = formatOrderResponse(data);

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Pedido_${id}.pdf`);
        doc.pipe(res);

        doc.fontSize(24).text('Tchapo Tchapo', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Fatura / Recibo - Pedido #${order.id}`);
        doc.moveDown();
        doc.fontSize(12).text(`Data: ${new Date(order.created_at).toLocaleString()}`);
        doc.text(`Cliente: ${order.customer_name}`);
        doc.text(`Telefone: ${order.phone || '—'}`);
        doc.text(`Bairro: ${order.bairro}`);
        doc.text(`Endereço: ${order.address}`);
        doc.text(`Horário: ${order.time}`);
        doc.text(`Pagamento: ${order.payment}`);
        doc.moveDown();
        doc.text(`Status: ${order.status}`);
        doc.moveDown();

        doc.fontSize(14).text('Produtos:', { underline: true });
        doc.moveDown(0.5);
        if (order.order_items && order.order_items.length > 0) {
            order.order_items.forEach((item, index) => {
                doc.fontSize(12).text(`${index + 1}. ${item.product_name} - Qtd: ${item.quantity} - Preço: ${Number(item.price).toLocaleString('pt-MZ')} MT`);
            });
        } else {
            doc.fontSize(12).text('Nenhum item encontrado para este pedido.');
        }
        doc.moveDown();

        doc.fontSize(16).text(`Total: ${Number(order.total).toLocaleString('pt-MZ')} MT`, { align: 'right' });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── REFERRALS ENDPOINTS ──────────────────────────────────────────────

// GET user referral code and balance stats (or auto-generate code)
app.post('/api/referrals/my-code', async (req, res) => {
    try {
        const { user_id, email, name } = req.body;
        if (!user_id || !email) {
            return res.status(400).json({ error: 'User ID and Email are required.' });
        }
        
        // Find existing referral record
        let { data, error } = await supabase
            .from('referrals')
            .select('*')
            .eq('user_id', user_id)
            .maybeSingle();
            
        if (error) throw error;
        
        if (!data) {
            // Generate a unique referral code
            // format: JOSUE12AB (first name up to 6 chars + last 4 chars of user_id)
            const cleanName = (name || email.split('@')[0])
                .replace(/[^a-zA-Z]/g, '')
                .toUpperCase();
            const prefix = cleanName.substring(0, 6) || 'TCHAPO';
            const suffix = user_id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || Math.random().toString(36).substring(2, 6).toUpperCase();
            let uniqueCode = `${prefix}${suffix}`;
            
            // Just in case it clashes, check and append a digit
            const { data: existingCode } = await supabase
                .from('referrals')
                .select('id')
                .eq('code', uniqueCode)
                .maybeSingle();
                
            if (existingCode) {
                uniqueCode = `${uniqueCode}${Math.floor(Math.random() * 10)}`;
            }
            
            const { data: newRecord, error: insertError } = await supabase
                .from('referrals')
                .insert([{
                    user_id,
                    user_email: email,
                    user_name: name || email.split('@')[0],
                    code: uniqueCode,
                    balance: 0.00,
                    total_earned: 0.00,
                    total_withdrawn: 0.00
                }])
                .select()
                .single();
                
            if (insertError) throw insertError;
            data = newRecord;
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET validate a referral code
app.get('/api/referrals/validate', async (req, res) => {
    try {
        const { code, user_id } = req.query;
        if (!code) {
            return res.status(400).json({ error: 'Code is required.' });
        }
        
        const { data, error } = await supabase
            .from('referrals')
            .select('*')
            .eq('code', code.trim().toUpperCase())
            .maybeSingle();
            
        if (error) throw error;
        
        if (!data) {
            return res.json({ valid: false, message: 'Código de indicação inválido.' });
        }
        
        if (user_id) {
            if (data.user_id === user_id) {
                return res.json({ valid: false, message: 'Não pode usar o seu próprio código.' });
            }
            
            // Check if this is the user's first purchase (excluding cancelled orders)
            const { data: userOrders, error: ordersError } = await supabase
                .from('orders')
                .select('id')
                .eq('user_id', user_id)
                .neq('status', 'Cancelado')
                .limit(1);
                
            if (ordersError) throw ordersError;
            
            if (userOrders && userOrders.length > 0) {
                return res.json({ valid: false, message: 'O desconto de indicação só é válido para a primeira compra.' });
            }
        }
        
        res.json({ valid: true, referrer_name: data.user_name || 'Usuário' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET referral transactions (earnings history)
app.get('/api/referrals/transactions', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        
        const { data, error } = await supabase
            .from('referral_transactions')
            .select('*')
            .eq('referrer_id', user_id)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET referral withdrawals history for a user
app.get('/api/referrals/withdrawals', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        
        const { data, error } = await supabase
            .from('referral_withdrawals')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST request withdrawal (Saque)
app.post('/api/referrals/withdraw', async (req, res) => {
    try {
        const { user_id, amount, phone, payment_method } = req.body;
        const withdrawAmount = Number(amount);
        
        if (!user_id || !phone || isNaN(withdrawAmount)) {
            return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
        }
        
        if (withdrawAmount < 50) {
            return res.status(400).json({ error: 'O saque mínimo é de 50 meticais.' });
        }
        
        // 1. Fetch user's referral balance
        const { data: referrer, error: refError } = await supabase
            .from('referrals')
            .select('*')
            .eq('user_id', user_id)
            .single();
            
        if (refError || !referrer) {
            return res.status(400).json({ error: 'Utilizador não registado no sistema de indicações.' });
        }
        
        if (Number(referrer.balance) < withdrawAmount) {
            return res.status(400).json({ error: 'Saldo insuficiente para este saque.' });
        }
        
        // 2. Insert withdrawal request (status Pendente)
        const { error: insertError } = await supabase
            .from('referral_withdrawals')
            .insert([{
                user_id,
                user_email: referrer.user_email,
                user_name: referrer.user_name || referrer.user_email.split('@')[0],
                amount: withdrawAmount,
                payment_phone: phone,
                payment_method: payment_method || 'M-Pesa',
                status: 'Pendente'
            }]);
            
        if (insertError) throw insertError;
        
        // 3. Deduct from balance to prevent double-spending
        const newBalance = Number(referrer.balance) - withdrawAmount;
        
        const { error: updateError } = await supabase
            .from('referrals')
            .update({ balance: newBalance })
            .eq('id', referrer.id);
            
        if (updateError) throw updateError;
        
        res.json({ success: true, message: 'Pedido de saque registado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET admin - list all withdrawals
app.get('/api/referrals/admin/withdrawals', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('referral_withdrawals')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT admin - update withdrawal status (Pago or Cancelado)
app.put('/api/referrals/admin/withdrawals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Pago' or 'Cancelado'
        
        if (status !== 'Pago' && status !== 'Cancelado') {
            return res.status(400).json({ error: 'Estado inválido.' });
        }
        
        // 1. Fetch current withdrawal request
        const { data: withdrawal, error: fetchError } = await supabase
            .from('referral_withdrawals')
            .select('*')
            .eq('id', id)
            .single();
            
        if (fetchError || !withdrawal) {
            return res.status(404).json({ error: 'Pedido de saque não encontrado.' });
        }
        
        if (withdrawal.status !== 'Pendente') {
            return res.status(400).json({ error: 'Este saque já foi processado.' });
        }
        
        // 2. If Pago, update status and increment referrals.total_withdrawn
        if (status === 'Pago') {
            const { error: updateWithdrawalError } = await supabase
                .from('referral_withdrawals')
                .update({ status: 'Pago' })
                .eq('id', id);
                
            if (updateWithdrawalError) throw updateWithdrawalError;
            
            // Increment total_withdrawn
            const { data: referrer, error: refError } = await supabase
                .from('referrals')
                .select('*')
                .eq('user_id', withdrawal.user_id)
                .single();
                
            if (!refError && referrer) {
                const newTotalWithdrawn = Number(referrer.total_withdrawn) + Number(withdrawal.amount);
                await supabase
                    .from('referrals')
                    .update({ total_withdrawn: newTotalWithdrawn })
                    .eq('id', referrer.id);
            }
        } 
        // 3. If Cancelado, refund referrals.balance
        else if (status === 'Cancelado') {
            const { error: updateWithdrawalError } = await supabase
                .from('referral_withdrawals')
                .update({ status: 'Cancelado' })
                .eq('id', id);
                
            if (updateWithdrawalError) throw updateWithdrawalError;
            
            const { data: referrer, error: refError } = await supabase
                .from('referrals')
                .select('*')
                .eq('user_id', withdrawal.user_id)
                .single();
                
            if (!refError && referrer) {
                const newBalance = Number(referrer.balance) + Number(withdrawal.amount);
                await supabase
                    .from('referrals')
                    .update({ balance: newBalance })
                    .eq('id', referrer.id);
            }
        }
        
        res.json({ success: true, message: `Pedido de saque marcado como ${status}!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
