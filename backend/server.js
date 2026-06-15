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
        const { customer_name, phone, bairro, address, time, payment, total, items, user_id } = req.body;
        
        let order;
        // Try inserting with items column (directly saving products array)
        const { data: dataWithItems, error: errorWithItems } = await supabase
            .from('orders')
            .insert([{ 
                customer_name, phone, bairro, address, time, payment, total, status: 'Processando', user_id: user_id || null,
                items: items || []
            }])
            .select()
            .single();

        if (errorWithItems) {
            // Fallback: If "items" column doesn't exist yet, insert without it
            if (errorWithItems.message.includes('column') || errorWithItems.message.includes('items')) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('orders')
                    .insert([{ 
                        customer_name, phone, bairro, address, time, payment, total, status: 'Processando', user_id: user_id || null
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
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('id', { ascending: false });
        
        if (error) {
            // Fallback se a tabela de produtos ainda não existir ou falhar
            console.error('Erro ao ler produtos do Supabase:', error.message);
            return res.json([]);
        }
        res.json(fixImageUrls(req, data));
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
