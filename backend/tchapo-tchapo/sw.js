const CACHE_NAME = 'tchapo-admin-v1';
let knownOrderIds = new Set();
let isPolling = false;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Listen for Web Push events (iOS & Android background push notifications)
self.addEventListener('push', (event) => {
    let data = {
        title: '🛍️ NOVO PEDIDO — Tchapo Tchapo!',
        body: 'Novo pedido recebido na loja!',
        icon: '/favicon.ico',
        url: '/admin.html'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: data.tag || 'new-order',
        renotify: true,
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300, 100, 400],
        data: {
            url: data.url || '/admin.html'
        }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Listen for messages from admin panel (e.g. initial order IDs list)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INIT_ORDERS') {
        if (Array.isArray(event.data.orderIds)) {
            event.data.orderIds.forEach(id => knownOrderIds.add(id));
        }
        startBackgroundPolling();
    }
});

// Periodic background check / polling fallback
async function checkNewOrders() {
    try {
        const res = await fetch('/api/orders');
        if (!res.ok) return;
        const orders = await res.json();
        
        let newOrdersFound = [];
        orders.forEach(order => {
            if (!knownOrderIds.has(order.id) && (!order.status || order.status === 'Pendente')) {
                knownOrderIds.add(order.id);
                newOrdersFound.push(order);
            }
        });

        for (const order of newOrdersFound) {
            const title = '🛍️ NOVO PEDIDO — Tchapo Tchapo!';
            const itemsSummary = Array.isArray(order.order_items) && order.order_items.length > 0
                ? order.order_items.map(i => `${i.quantity}x ${i.product_name}`).join(', ')
                : 'Produtos no pedido';

            const options = {
                body: `👤 ${order.customer_name || 'Cliente'} (${order.bairro || 'Maputo'})\n📦 ${itemsSummary}\n💰 Total: ${Number(order.total || 0).toLocaleString('pt-MZ')} MT`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `order-${order.id}`,
                renotify: true,
                requireInteraction: true,
                vibrate: [300, 100, 300, 100, 300, 100, 400],
                data: {
                    url: '/admin.html',
                    orderId: order.id
                }
            };

            await self.registration.showNotification(title, options);
        }
    } catch (err) {
        console.error('[SW] Order check error:', err);
    }
}

function startBackgroundPolling() {
    if (isPolling) return;
    isPolling = true;
    checkNewOrders();
    setInterval(checkNewOrders, 8000); // Check every 8 seconds in background
}

// Notification click event -> open admin panel
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/admin.html';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('admin') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
