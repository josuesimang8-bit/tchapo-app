const CACHE_NAME = 'tchapo-admin-v2';
let shownOrderTags = new Set();

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Listen for Web Push events (iOS & Android background push notifications)
self.addEventListener('push', (event) => {
    let data = {
        title: '🚨 NOVO PEDIDO — Tchapo Tchapo!',
        body: 'Novo pedido recebido na loja!',
        icon: '/favicon.ico',
        url: '/admin.html',
        tag: 'new-order'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const notifTag = data.tag || 'order-general';

    // Prevent displaying duplicate notifications within the same service worker session
    if (shownOrderTags.has(notifTag)) {
        return;
    }
    shownOrderTags.add(notifTag);
    if (shownOrderTags.size > 100) {
        const first = shownOrderTags.values().next().value;
        shownOrderTags.delete(first);
    }

    const options = {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: notifTag,
        renotify: false,
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        data: {
            url: data.url || '/admin.html'
        }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

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
