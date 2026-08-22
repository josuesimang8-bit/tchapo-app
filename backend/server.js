import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import webpush from 'web-push';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BAxlp2zq_g-ExdDWsJUsC6z1FWpSg6L-ysw64w_ouuJtselkPdEvPbo3yH9BBddaRzPbvTQGqyE7MS36Ns1ygvM';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'CbknALrndzXKpMaXfYOeO32QAyh9CG-I6F53pjX9Pmw';

webpush.setVapidDetails(
    'mailto:admin@tchapotchapo.store',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// ─── ADMIN NOTIFICATION SYSTEM (TELEGRAM + PERSISTENT WEB PUSH) ─────────
const PUSH_SUBS_FILE = path.join(__dirname, 'data', 'push_subscriptions.json');
const ADMIN_SETTINGS_FILE = path.join(__dirname, 'data', 'admin_settings.json');

function loadPushSubscriptions() {
    try {
        if (fs.existsSync(PUSH_SUBS_FILE)) {
            const raw = fs.readFileSync(PUSH_SUBS_FILE, 'utf8');
            return JSON.parse(raw) || [];
        }
    } catch (_) {}
    return [];
}

function savePushSubscriptions(subs) {
    try {
        const dir = path.dirname(PUSH_SUBS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(PUSH_SUBS_FILE, JSON.stringify(subs, null, 2), 'utf8');
    } catch (_) {}
}

function loadAdminSettings() {
    try {
        if (fs.existsSync(ADMIN_SETTINGS_FILE)) {
            const raw = fs.readFileSync(ADMIN_SETTINGS_FILE, 'utf8');
            return JSON.parse(raw) || {};
        }
    } catch (_) {}
    return {};
}

function saveAdminSettings(settings) {
    try {
        const dir = path.dirname(ADMIN_SETTINGS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(ADMIN_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    } catch (_) {}
}

let pushSubscriptions = loadPushSubscriptions();

app.get('/api/admin/vapid-public-key', (req, res) => {
    res.json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post('/api/admin/subscribe-push', (req, res) => {
    const subscription = req.body;
    if (subscription && subscription.endpoint) {
        if (!pushSubscriptions.find(s => s.endpoint === subscription.endpoint)) {
            pushSubscriptions.push(subscription);
            savePushSubscriptions(pushSubscriptions);
            console.log('[WebPush] New admin subscription persisted. Total subscribers:', pushSubscriptions.length);
        }
    }
    res.status(201).json({ status: 'subscribed', total: pushSubscriptions.length });
});

// Admin Notification Settings endpoints
app.get('/api/admin/settings', (req, res) => {
    const settings = loadAdminSettings();
    res.json({
        ntfy_topic: settings.ntfy_topic || 'tchapo_pedidos_beira',
        whatsapp_configured: Boolean(settings.whatsapp_phone && settings.whatsapp_apikey),
        whatsapp_phone: settings.whatsapp_phone || '',
        whatsapp_apikey_set: Boolean(settings.whatsapp_apikey),
        telegram_configured: Boolean(process.env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token),
        telegram_chat_id: process.env.TELEGRAM_CHAT_ID || settings.telegram_chat_id || '',
        push_subscribers_count: pushSubscriptions.length
    });
});

app.post('/api/admin/settings', (req, res) => {
    try {
        const { ntfy_topic, whatsapp_phone, whatsapp_apikey, telegram_bot_token, telegram_chat_id } = req.body;
        const current = loadAdminSettings();
        if (ntfy_topic !== undefined) current.ntfy_topic = ntfy_topic.trim();
        if (whatsapp_phone !== undefined) current.whatsapp_phone = whatsapp_phone.trim();
        if (whatsapp_apikey !== undefined) current.whatsapp_apikey = whatsapp_apikey.trim();
        if (telegram_bot_token !== undefined) current.telegram_bot_token = telegram_bot_token.trim();
        if (telegram_chat_id !== undefined) current.telegram_chat_id = telegram_chat_id.trim();
        saveAdminSettings(current);
        res.json({ success: true, settings: current });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NTFY Instant Mobile Notification (100% Free, Open-Source, Zero-Account, Rings Phone Loudly)
async function sendNtfyAlert(order) {
    const settings = loadAdminSettings();
    const topic = (settings.ntfy_topic || process.env.NTFY_TOPIC || 'tchapo_pedidos_beira').trim();

    if (!topic) return false;

    try {
        const itemsList = Array.isArray(order.items) && order.items.length > 0
            ? order.items.map(i => `• ${i.quantity || 1}x ${i.product_name || i.name} (${Number(i.price || 0).toLocaleString('pt-MZ')} MT)`).join('\n')
            : '• 1x Produto';

        const bodyText = 
`👤 Cliente: ${order.customer_name || 'Cliente'} (${order.customer_phone || 'Sem telefone'})
📍 Bairro: ${order.bairro || 'Beira'} | ${order.address || '—'}
💳 Pagamento: ${order.payment_method || 'Dinheiro na Entrega'}

📦 PRODUTOS:
${itemsList}

💰 TOTAL: ${Number(order.total || 0).toLocaleString('pt-MZ')} MT`;

        const res = await fetch('https://ntfy.sh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topic,
                title: `🚨 NOVO PEDIDO #${order.id} — ${Number(order.total || 0).toLocaleString('pt-MZ')} MT`,
                message: bodyText,
                priority: 5, // Maximum urgent priority: vibrates & plays loud notification
                tags: ['shopping_cart', 'rotating_light', 'loudspeaker'],
                click: 'https://tchapotchapo.store/admin.html'
            })
        });

        if (res.ok) {
            console.log('[NtfyAlert] ✅ Alert delivered via Ntfy to topic:', topic);
            return true;
        } else {
            console.error('[NtfyAlert] ❌ Failed to send Ntfy notification. Status:', res.status);
            return false;
        }
    } catch (err) {
        console.error('[NtfyAlert] ❌ Network error sending Ntfy alert:', err.message);
        return false;
    }
}

// WhatsApp Notification Sender (via CallMeBot API - 100% Free & Direct to Phone)
async function sendWhatsAppAlert(order) {
    const settings = loadAdminSettings();
    let phone = (settings.whatsapp_phone || process.env.WHATSAPP_PHONE || '').replace(/[^0-9+]/g, '');
    const apiKey = settings.whatsapp_apikey || process.env.WHATSAPP_APIKEY;

    if (!phone || !apiKey) {
        console.log('[WhatsAppAlert] ℹ️ WhatsApp phone or API key not configured. (Configure in Admin Panel for WhatsApp alerts)');
        return false;
    }

    if (!phone.startsWith('+')) phone = '+' + phone;

    try {
        const itemsList = Array.isArray(order.items) && order.items.length > 0
            ? order.items.map(i => `* ${i.quantity || 1}x ${i.product_name || i.name} (${Number(i.price || 0).toLocaleString('pt-MZ')} MT)`).join('\n')
            : '* 1x Produto';

        const message = 
`🚨 *NOVO PEDIDO RECEBIDO! #${order.id}* 🛍️

👤 *Cliente:* ${order.customer_name || 'Cliente'}
📞 *Telefone:* ${order.customer_phone || 'Sem telefone'}
📍 *Bairro:* ${order.bairro || 'Beira'}
🏠 *Endereço:* ${order.address || '—'}
💳 *Pagamento:* ${order.payment_method || 'Dinheiro na Entrega'}

📦 *PRODUTOS:*
${itemsList}

💰 *TOTAL:* *${Number(order.total || 0).toLocaleString('pt-MZ')} MT*
⏱️ *Hora:* ${new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}

👉 *Painel Admin:* https://tchapotchapo.store/admin.html`;

        const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
        const res = await fetch(waUrl, { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
            console.log('[WhatsAppAlert] ✅ Alert delivered to WhatsApp phone:', phone);
            return true;
        } else {
            console.error('[WhatsAppAlert] ❌ Failed to send WhatsApp message. HTTP status:', res.status);
            return false;
        }
    } catch (err) {
        console.error('[WhatsAppAlert] ❌ Network error sending WhatsApp alert:', err.message);
        return false;
    }
}

// Telegram Notification Sender
async function sendTelegramAlert(order) {
    const settings = loadAdminSettings();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
    const chatId = process.env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;

    if (!botToken || !chatId) {
        return false;
    }

    try {
        const itemsList = Array.isArray(order.items) && order.items.length > 0
            ? order.items.map(i => `▫️ <b>${i.quantity || 1}x</b> ${i.product_name || i.name} (${Number(i.price || 0).toLocaleString('pt-MZ')} MT)`).join('\n')
            : '▫️ 1x Produto';

        const message = 
`🚨 <b>NOVO PEDIDO RECEBIDO! #${order.id}</b> 🛍️

👤 <b>Cliente:</b> ${order.customer_name || 'Cliente'}
📞 <b>Telefone:</b> <code>${order.customer_phone || 'Sem telefone'}</code>
📍 <b>Bairro:</b> ${order.bairro || 'Beira'}
🏠 <b>Endereço:</b> ${order.address || '—'}
💳 <b>Pagamento:</b> ${order.payment_method || 'Dinheiro na Entrega'}

📦 <b>PRODUTOS:</b>
${itemsList}

💰 <b>TOTAL:</b> <b>${Number(order.total || 0).toLocaleString('pt-MZ')} MT</b>
⏱️ <b>Hora:</b> ${new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}

👉 <a href="https://tchapotchapo.store/admin.html">Abrir Painel Admin</a>`;

        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        const respData = await res.json();
        if (respData.ok) {
            console.log('[TelegramAlert] ✅ Alert delivered to Telegram chat:', chatId);
            return true;
        } else {
            console.error('[TelegramAlert] ❌ Telegram API error:', respData.description);
            return false;
        }
    } catch (err) {
        console.error('[TelegramAlert] ❌ Failed to send Telegram alert:', err.message);
        return false;
    }
}

// Web Push Notification Sender (Deduplicated)
async function sendWebPushNotification(order) {
    if (pushSubscriptions.length === 0) return;
    
    // Deduplicate subscribers by endpoint
    const uniqueSubs = [];
    const seenEndpoints = new Set();
    for (const sub of pushSubscriptions) {
        if (sub && sub.endpoint && !seenEndpoints.has(sub.endpoint)) {
            seenEndpoints.add(sub.endpoint);
            uniqueSubs.push(sub);
        }
    }

    if (uniqueSubs.length !== pushSubscriptions.length) {
        pushSubscriptions = uniqueSubs;
        savePushSubscriptions(pushSubscriptions);
    }
    
    const itemsSummary = Array.isArray(order.items) && order.items.length > 0
        ? order.items.map(i => `${i.quantity || 1}x ${i.product_name || i.name}`).join(', ')
        : 'Produtos no pedido';

    const payload = JSON.stringify({
        title: '🚨 NOVO PEDIDO — Tchapo Tchapo!',
        body: `👤 ${order.customer_name || 'Cliente'} (${order.bairro || 'Beira'})\n📦 ${itemsSummary}\n💰 Total: ${Number(order.total || 0).toLocaleString('pt-MZ')} MT`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `order-${order.id || 'general'}`,
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        url: '/admin.html'
    });

    for (let i = pushSubscriptions.length - 1; i >= 0; i--) {
        const sub = pushSubscriptions[i];
        try {
            await webpush.sendNotification(sub, payload, { urgency: 'high' });
            console.log('[WebPush] Push delivered to device:', sub.endpoint.slice(0, 35));
        } catch (err) {
            console.error('[WebPush] Failed to send push:', err.statusCode || err.message);
            if (err.statusCode === 410 || err.statusCode === 404) {
                pushSubscriptions.splice(i, 1);
                savePushSubscriptions(pushSubscriptions);
            }
        }
    }
}

// Master Dispatcher (Never fails - Multi-channel fallback: Ntfy + WhatsApp + Web Push + Telegram)
async function notifyAdminNewOrder(order) {
    console.log(`[NotificationEngine] 🔔 Dispatching notification for Order #${order.id}...`);
    // 1. Instant Mobile Siren Push via Ntfy (100% Free, Guaranteed Sound & Vibration, Zero-Setup)
    sendNtfyAlert(order).catch(e => console.error('[NotificationEngine] Ntfy dispatch err:', e));
    // 2. Direct WhatsApp Message (if configured)
    sendWhatsAppAlert(order).catch(e => console.error('[NotificationEngine] WhatsApp dispatch err:', e));
    // 3. Web Push Notification to all subscribed devices
    sendWebPushNotification(order).catch(e => console.error('[NotificationEngine] WebPush dispatch err:', e));
    // 4. Telegram push (optional fallback if configured)
    sendTelegramAlert(order).catch(e => console.error('[NotificationEngine] Telegram dispatch err:', e));
}

// Test Notification Endpoint
app.post('/api/admin/test-notification', async (req, res) => {
    try {
        const testOrder = {
            id: 'TESTE-999',
            customer_name: 'Teste Admin Tchapo',
            customer_phone: '859272314',
            bairro: 'Ponta Gêa, Beira',
            address: 'Rua de Teste, Casa 12',
            payment_method: 'M-Pesa',
            total: 1500,
            items: [
                { product_name: 'Produto Exemplo de Teste', quantity: 2, price: 750 }
            ]
        };

        const ntfyResult = await sendNtfyAlert(testOrder);
        const waResult = await sendWhatsAppAlert(testOrder);
        const tgResult = await sendTelegramAlert(testOrder);
        await sendWebPushNotification(testOrder);

        res.json({
            success: true,
            ntfy_sent: ntfyResult,
            whatsapp_sent: waResult,
            telegram_sent: tgResult,
            push_subscribers: pushSubscriptions.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Servir o frontend estático do Tchapo Tchapo
app.use(express.static(path.join(__dirname, 'tchapo-tchapo')));

// Rota para o painel admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'tchapo-tchapo', 'admin.html'));
});

// Ping / Health check endpoint for Keep-Alive & Uptime monitoring
app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

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

// ─── IMAGE PROXY ──────────────────────────────────────────────────────────────
// Serve external product images (Catbox etc.) through our server so they
// load reliably on any network/region. Cache in memory for 24h.
const _imgCache = new Map();

app.get('/api/img', async (req, res) => {
    const url = req.query.u;
    if (!url) return res.status(400).send('Missing url');

    // Only proxy known image hosts
    const ALLOWED_HOSTS = ['files.catbox.moe', 'catbox.moe', 'i.imgur.com', 'imgur.com'];
    let isAllowed = false;
    try {
        const parsed = new URL(url);
        isAllowed = ALLOWED_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h));
    } catch (_) {}
    if (!isAllowed) return res.status(403).send('Forbidden');

    // Serve from cache if fresh (24h)
    const cached = _imgCache.get(url);
    if (cached && (Date.now() - cached.t) < 86400000) {
        res.set('Content-Type', cached.ct);
        res.set('Cache-Control', 'public, max-age=86400');
        return res.end(cached.d);
    }

    try {
        const upstream = await fetch(url, {
            signal: AbortSignal.timeout(12000),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        });
        if (!upstream.ok) return res.status(upstream.status).send('Upstream error');

        const buf = Buffer.from(await upstream.arrayBuffer());
        const ct = upstream.headers.get('content-type') || 'image/jpeg';

        // Only cache if < 3MB to avoid OOM on free tier
        if (buf.byteLength < 3145728) {
            _imgCache.set(url, { d: buf, ct, t: Date.now() });
        }

        res.set('Content-Type', ct);
        res.set('Cache-Control', 'public, max-age=86400');
        res.end(buf);
    } catch (err) {
        console.error('[ImageProxy] Failed:', url.slice(0, 60), err.message);
        res.status(502).send('Failed to fetch image');
    }
});
// ─────────────────────────────────────────────────────────────────────────────

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
        price: item.price || 0,
        image: item.image || item.image_url || item.photo_url || null
    })) : [];

    // Timer computation from created_at
    const createdDate = new Date(order.created_at);
    const createdMs = createdDate.getTime();
    const nowMs = Date.now();
    let timer_end_at = null;
    let timer_remaining_secs = 14400;

    if (!order.status || order.status === 'Pendente') {
        // Paused state
        if (createdDate.getFullYear() === 1970) {
            // Epoch marker: remaining seconds frozen at pause time
            timer_remaining_secs = Math.floor(createdMs / 1000);
        } else {
            // Brand new order, full 4h
            timer_remaining_secs = 14400;
        }
        timer_end_at = null; // null means paused
    } else if (['Entregue', 'Cancelado', 'Perdido'].includes(order.status)) {
        timer_remaining_secs = 0;
        timer_end_at = null;
    } else {
        // Active: Processando, Preparando, Com Motorista
        timer_remaining_secs = Math.max(0, 14400 - Math.floor((nowMs - createdMs) / 1000));
        timer_end_at = new Date(createdMs + 14400 * 1000).toISOString();
    }

    return {
        ...order,
        items: normalizedItems,
        order_items: normalizedItems,
        timer_end_at,
        timer_remaining_secs
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
                customer_name, phone, bairro, address, time, payment, total: finalTotal, status: 'Pendente', user_id: user_id || null,
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
                        customer_name, phone, bairro, address, time, payment, total: finalTotal, status: 'Pendente', user_id: user_id || null,
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

        const formattedOrder = formatOrderResponse(order);
        notifyAdminNewOrder(formattedOrder).catch(err => console.error('[NotificationEngine] Dispatch error:', err));
        res.status(201).json(formattedOrder);
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
        
        // Timer management on status change
        if (status !== undefined) {
            const { data: currentOrder } = await supabase
                .from('orders')
                .select('status, created_at')
                .eq('id', id)
                .single();
                
            if (currentOrder) {
                const wasPendente = !currentOrder.status || currentOrder.status === 'Pendente';
                const wasActive = ['Processando', 'Preparando', 'Com Motorista'].includes(currentOrder.status);
                const isNowActive = ['Processando', 'Preparando', 'Com Motorista'].includes(status);
                const isNowPendente = status === 'Pendente';
                const createdDate = new Date(currentOrder.created_at);
                const createdMs = createdDate.getTime();
                const nowMs = Date.now();
                
                if (wasPendente && isNowActive) {
                    // Resume or start the timer
                    if (createdDate.getFullYear() === 1970) {
                        // Was paused with frozen remaining seconds encoded in epoch marker
                        const remainingSecs = Math.floor(createdMs / 1000);
                        // Set created_at so that 4h - (now - created_at) = remainingSecs
                        // created_at = now - (14400 - remainingSecs)
                        updates.created_at = new Date(nowMs - (14400 - remainingSecs) * 1000).toISOString();
                    } else {
                        // First activation: start fresh 4h timer
                        updates.created_at = new Date().toISOString();
                    }
                } else if (wasActive && isNowPendente) {
                    // Pause timer: calculate remaining time and store as frozen epoch marker (1970-01-01 + remainingSecs)
                    const remainingSecs = Math.max(0, 14400 - Math.floor((nowMs - createdMs) / 1000));
                    updates.created_at = new Date(remainingSecs * 1000).toISOString();
                }
            }
        }
        
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

        res.json(formatOrderResponse(data));
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
        // Unassign driver from any assigned orders first to satisfy foreign key constraints
        await supabase.from('orders').update({ driver_id: null }).eq('driver_id', id);
        
        const { error } = await supabase.from('drivers').delete().eq('id', id);
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ error: error.message });
    }
});

// ─── PRODUCTS ENDPOINTS ────────────────────────────────────────────────
// Helper to resolve product image URLs dynamically to the backend host origin
function resolveSingleImg(img, baseUrl, PLACEHOLDER) {
    if (!img || typeof img !== 'string' || img.trim() === '') {
        return PLACEHOLDER;
    }
    const PROXY_HOSTS = ['files.catbox.moe', 'catbox.moe'];
    try {
        const parsed = new URL(img);
        const needsProxy = PROXY_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h));
        if (needsProxy) {
            return `${baseUrl}/api/img?u=${encodeURIComponent(img)}`;
        }
    } catch (_) {}

    if (img.startsWith('http://localhost:3000') || img.startsWith('http://localhost:5173') || !img.startsWith('http')) {
        const cleanPath = img.replace(/^https?:\/\/localhost:\d+/, '');
        const relativePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
        return `${baseUrl}${relativePath}`;
    }
    return img;
}

function fixImageUrls(req, products) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    const PLACEHOLDER = `${baseUrl}/assets/default_product.png`;

    const arrayProducts = Array.isArray(products) ? products : [products];
    const resolved = arrayProducts.map(p => {
        if (!p) return p;
        const mainImg = resolveSingleImg(p.image, baseUrl, PLACEHOLDER);
        let features = p.features;
        if (Array.isArray(features)) {
            features = features.map(f => {
                if (typeof f === 'string' && f.match(/^_img\d+:/)) {
                    const match = f.match(/^(_img\d+:)(.*)$/);
                    if (match) {
                        const prefix = match[1];
                        const url = match[2];
                        return prefix + resolveSingleImg(url, baseUrl, PLACEHOLDER);
                    }
                }
                return f;
            });
        }
        return {
            ...p,
            image: mainImg,
            features
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
        // If Catbox was used as fallback, wrap in our image proxy for reliability
        let finalUrl = publicUrl;
        try {
            const parsed = new URL(publicUrl);
            const PROXY_HOSTS = ['files.catbox.moe', 'catbox.moe'];
            if (PROXY_HOSTS.some(h => parsed.hostname === h)) {
                const proto = req.headers['x-forwarded-proto'] || req.protocol;
                const base = `${proto}://${req.get('host')}`;
                finalUrl = `${base}/api/img?u=${encodeURIComponent(publicUrl)}`;
            }
        } catch (_) {}
        res.json({ photo_url: finalUrl });
    } else {
        // Fallback to local file path (served by Express static middleware)
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

// DEBUG: raw items stored in Supabase for an order (remove after debugging)
app.get('/api/orders/:id/debug-items', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('orders').select('id, items').eq('id', id).single();
        if (error) throw error;
        const raw = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
        const summary = (raw || []).map(it => ({
            name: it.name || it.product_name,
            image: it.image || it.image_url || null
        }));
        res.json({ orderId: id, rawCount: (raw || []).length, summary });
    } catch (e) {
        res.status(500).json({ error: e.message });
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

        const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Pedido_${id}.pdf`);
        doc.pipe(res);

        // Header / Branding
        doc.fontSize(22).fillColor('#f59e0b').text('TCHAPO TCHAPO', { align: 'center' });
        doc.fontSize(10).fillColor('#6b7280').text('Entregas Rápidas na Cidade da Beira', { align: 'center' });
        doc.moveDown(1.2);

        // Receipt Details Box
        doc.fontSize(14).fillColor('#111827').text(`Fatura / Recibo - Pedido #${order.id}`, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#374151');
        doc.text(`Data: ${new Date(order.created_at).toLocaleString('pt-MZ')}`);
        doc.text(`Cliente: ${order.customer_name}`);
        doc.text(`Telefone: ${order.phone || '—'}`);
        doc.text(`Bairro: ${order.bairro}`);
        doc.text(`Endereço: ${order.address}`);
        doc.text(`Horário de Entrega: ${order.time}`);
        doc.text(`Método de Pagamento: ${order.payment}`);
        doc.text(`Estado do Pedido: ${order.status}`);
        doc.moveDown(1.5);

        // Products List
        doc.fontSize(14).fillColor('#111827').text('Produtos Selecionados:', { underline: true });
        doc.moveDown(0.75);

        if (order.order_items && order.order_items.length > 0) {
            for (let index = 0; index < order.order_items.length; index++) {
                const item = order.order_items[index];
                const startY = doc.y;

                // Resolve image URL: use stored image, or fall back to products table by name
                let imageUrl = item.image || null;
                console.log(`[PDF] item "${item.product_name}" → stored image: ${imageUrl}`);
                if (!imageUrl) {
                    try {
                        const baseName = (item.product_name || '').split('(')[0].trim();
                        const { data: prodRows } = await supabase
                            .from('products')
                            .select('image')
                            .ilike('name', `%${baseName}%`)
                            .limit(1);
                        if (prodRows && prodRows.length > 0) imageUrl = prodRows[0].image;
                    } catch (_) {}
                }

                // Download and embed image (120x120)
                let hasImg = false;
                if (imageUrl) {
                    try {
                        const imgRes = await fetch(imageUrl);
                        if (imgRes.ok) {
                            const imgBuf = Buffer.from(await imgRes.arrayBuffer());
                            doc.image(imgBuf, 40, startY, { fit: [120, 120] });
                            hasImg = true;
                        } else {
                            console.warn(`PDF image HTTP ${imgRes.status} for: ${imageUrl}`);
                        }
                    } catch (imgErr) {
                        console.warn(`Failed to embed PDF image for "${item.product_name}":`, imgErr.message);
                    }
                }

                const textX = hasImg ? 172 : 40;
                const textTopY = hasImg ? startY + 10 : startY;
                doc.fontSize(12).fillColor('#111827').text(`${index + 1}. ${item.product_name}`, textX, textTopY);
                doc.fontSize(10).fillColor('#6b7280').text(`Quantidade: ${item.quantity}  |  Preço: ${Number(item.price).toLocaleString('pt-MZ')} MT`, textX, doc.y + 4);

                const itemBoxHeight = hasImg ? 135 : 50;
                doc.y = startY + itemBoxHeight;
                doc.x = 40;
            }
        } else {
            doc.fontSize(11).fillColor('#6b7280').text('Nenhum item encontrado para este pedido.');
        }

        doc.moveDown(1.5);
        doc.fontSize(16).fillColor('#111827').text(`Total: ${Number(order.total).toLocaleString('pt-MZ')} MT`, { align: 'right' });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
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

// POST /api/users/heartbeat - Atualizar última atividade do utilizador
app.post('/api/users/heartbeat', async (req, res) => {
    try {
        const { user_id, user_email } = req.body;
        if (!user_id && !user_email) return res.status(400).json({ error: 'Informação do utilizador obrigatória.' });

        const now = new Date().toISOString();
        if (user_id) {
            await supabase.from('referrals').update({ last_seen_at: now }).eq('user_id', user_id);
        } else if (user_email) {
            await supabase.from('referrals').update({ last_seen_at: now }).eq('user_email', user_email);
        }
        res.json({ success: true, timestamp: now });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/admin - Listar contas criadas e estado de acesso
app.get('/api/users/admin', async (req, res) => {
    try {
        const { data: refUsers } = await supabase
            .from('referrals')
            .select('*')
            .order('created_at', { ascending: false });

        const { data: orders } = await supabase
            .from('orders')
            .select('customer_name, customer_phone, customer_email, created_at, user_id')
            .order('created_at', { ascending: false });

        const userMap = new Map();

        if (refUsers && Array.isArray(refUsers)) {
            refUsers.forEach(u => {
                const key = u.user_email || u.user_id;
                userMap.set(key, {
                    id: u.user_id,
                    name: u.user_name || (u.user_email ? u.user_email.split('@')[0] : 'Cliente'),
                    email: u.user_email || 'Sem email',
                    phone: u.user_phone || 'Sem telefone',
                    created_at: u.created_at,
                    last_seen_at: u.last_seen_at || u.created_at,
                    referral_code: u.referral_code || 'N/A',
                    balance: u.balance || 0,
                    order_count: 0
                });
            });
        }

        if (orders && Array.isArray(orders)) {
            orders.forEach(o => {
                const key = o.customer_email || o.user_id || o.customer_name;
                if (!userMap.has(key)) {
                    userMap.set(key, {
                        id: o.user_id || `order-${o.customer_name}`,
                        name: o.customer_name || 'Cliente',
                        email: o.customer_email || 'N/A',
                        phone: o.customer_phone || 'N/A',
                        created_at: o.created_at,
                        last_seen_at: o.created_at,
                        referral_code: 'N/A',
                        balance: 0,
                        order_count: 1
                    });
                } else {
                    const existing = userMap.get(key);
                    existing.order_count += 1;
                    if (new Date(o.created_at) > new Date(existing.last_seen_at)) {
                        existing.last_seen_at = o.created_at;
                    }
                    if ((!existing.phone || existing.phone === 'Sem telefone') && o.customer_phone) {
                        existing.phone = o.customer_phone;
                    }
                }
            });
        }

        const userList = Array.from(userMap.values()).map(u => {
            const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
            const isOnline = new Date(u.last_seen_at) > tenMinsAgo;
            return {
                ...u,
                is_online: isOnline
            };
        });

        res.json(userList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── FINANCIAL ENTRIES & REVENUE MANAGEMENT ─────────────────────────────────
const FINANCE_FILE = path.join(__dirname, 'data', 'financial_entries.json');

function ensureFinanceDataDir() {
    const dir = path.dirname(FINANCE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(FINANCE_FILE)) fs.writeFileSync(FINANCE_FILE, '[]', 'utf8');
}

function readLocalFinanceEntries() {
    ensureFinanceDataDir();
    try {
        const raw = fs.readFileSync(FINANCE_FILE, 'utf8');
        return JSON.parse(raw) || [];
    } catch (_) {
        return [];
    }
}

function writeLocalFinanceEntries(entries) {
    ensureFinanceDataDir();
    fs.writeFileSync(FINANCE_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

// GET all financial entries with optional filters & computed summary
app.get('/api/financial-entries', async (req, res) => {
    try {
        let entries = [];
        // Try Supabase first
        const { data, error } = await supabase
            .from('financial_entries')
            .select('*')
            .order('entry_date', { ascending: false });

        if (!error && data) {
            entries = data;
        } else {
            // Fallback to local storage
            entries = readLocalFinanceEntries();
        }

        const { type, category, payment_method, period, startDate, endDate } = req.query;

        let filtered = entries.map(e => ({
            ...e,
            id: Number(e.id),
            amount: Number(e.amount) || 0,
            created_at: e.created_at || new Date().toISOString()
        }));

        // Date / Period filter
        const now = new Date();
        if (period === 'today') {
            const todayStr = now.toISOString().slice(0, 10);
            filtered = filtered.filter(e => e.entry_date === todayStr);
        } else if (period === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(e => new Date(e.entry_date) >= oneWeekAgo);
        } else if (period === 'month') {
            const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
            filtered = filtered.filter(e => e.entry_date && e.entry_date.startsWith(currentMonth));
        } else if (startDate || endDate) {
            if (startDate) filtered = filtered.filter(e => e.entry_date >= startDate);
            if (endDate) filtered = filtered.filter(e => e.entry_date <= endDate);
        }

        // Type filter (receita, despesa, investimento, retirada)
        if (type && type !== 'all') {
            filtered = filtered.filter(e => (e.type || '').toLowerCase() === type.toLowerCase());
        }

        // Category filter
        if (category && category !== 'all') {
            filtered = filtered.filter(e => (e.category || '').toLowerCase() === category.toLowerCase());
        }

        // Payment method filter
        if (payment_method && payment_method !== 'all') {
            filtered = filtered.filter(e => (e.payment_method || '').toLowerCase() === payment_method.toLowerCase());
        }

        // Sort descending by date
        filtered.sort((a, b) => new Date(b.entry_date || b.created_at) - new Date(a.entry_date || a.created_at));

        // Compute summary metrics
        let total_revenue = 0;       // Receitas
        let total_expenses = 0;      // Despesas
        let total_investments = 0;   // Investimentos
        let total_withdrawals = 0;   // Retiradas

        filtered.forEach(e => {
            const t = (e.type || '').toLowerCase();
            const amt = Number(e.amount) || 0;
            if (t === 'receita') total_revenue += amt;
            else if (t === 'despesa') total_expenses += amt;
            else if (t === 'investimento') total_investments += amt;
            else if (t === 'retirada') total_withdrawals += amt;
        });

        const net_profit = total_revenue - total_expenses;
        const current_balance = (total_revenue + total_investments) - (total_expenses + total_withdrawals);

        res.json({
            entries: filtered,
            summary: {
                total_revenue,
                total_expenses,
                total_investments,
                total_withdrawals,
                net_profit,
                current_balance,
                total_count: filtered.length
            }
        });
    } catch (err) {
        console.error('Error fetching financial entries:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new financial entry
app.post('/api/financial-entries', async (req, res) => {
    try {
        const { type, description, amount, category, payment_method, entry_date, notes } = req.body;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 0) {
            return res.status(400).json({ error: 'O valor deve ser um número positivo válido.' });
        }

        const validDesc = (description && description.trim()) ? description.trim() : (category || 'Lançamento Manual');

        const newEntry = {
            type: (type || 'receita').toLowerCase(),
            description: validDesc,
            amount: numAmount,
            category: category || 'Geral',
            payment_method: payment_method || 'Dinheiro',
            entry_date: entry_date || new Date().toISOString().slice(0, 10),
            notes: notes || '',
            created_at: new Date().toISOString()
        };

        // Try Supabase insert
        const { data, error } = await supabase
            .from('financial_entries')
            .insert([newEntry])
            .select()
            .single();

        if (!error && data) {
            return res.status(201).json(data);
        }

        // Local fallback
        const localList = readLocalFinanceEntries();
        const localEntry = {
            id: Date.now(),
            ...newEntry
        };
        localList.unshift(localEntry);
        writeLocalFinanceEntries(localList);

        res.status(201).json(localEntry);
    } catch (err) {
        console.error('Error creating financial entry:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update financial entry
app.put('/api/financial-entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, description, amount, category, payment_method, entry_date, notes } = req.body;

        const updates = {};
        if (type !== undefined) updates.type = String(type).toLowerCase();
        if (description !== undefined) updates.description = String(description).trim();
        if (amount !== undefined) updates.amount = Number(amount);
        if (category !== undefined) updates.category = category;
        if (payment_method !== undefined) updates.payment_method = payment_method;
        if (entry_date !== undefined) updates.entry_date = entry_date;
        if (notes !== undefined) updates.notes = notes;

        // Try Supabase update
        const { data, error } = await supabase
            .from('financial_entries')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (!error && data) {
            return res.json(data);
        }

        // Local fallback
        const localList = readLocalFinanceEntries();
        const idx = localList.findIndex(e => String(e.id) === String(id));
        if (idx !== -1) {
            localList[idx] = { ...localList[idx], ...updates };
            writeLocalFinanceEntries(localList);
            return res.json(localList[idx]);
        }

        res.status(404).json({ error: 'Lançamento não encontrado.' });
    } catch (err) {
        console.error('Error updating financial entry:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE financial entry
app.delete('/api/financial-entries/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Try Supabase delete
        const { error } = await supabase
            .from('financial_entries')
            .delete()
            .eq('id', id);

        // Also clean from local file
        const localList = readLocalFinanceEntries();
        const filtered = localList.filter(e => String(e.id) !== String(id));
        writeLocalFinanceEntries(filtered);

        res.json({ success: true, id });
    } catch (err) {
        console.error('Error deleting financial entry:', err);
        res.status(500).json({ error: err.message });
    }
});
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
