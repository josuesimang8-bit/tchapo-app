// Tchapo Tchapo Service Worker — High-reliability Web Push & PWA Hub
const CACHE_NAME = 'tchapo-pwa-v3';
let shownOrderTags = new Set();

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Listen for Web Push events (Background push for Store, Drivers, and Admin)
self.addEventListener('push', (event) => {
    let data = {
        title: 'Tchapo Tchapo',
        body: 'Nova notificação da Tchapo Tchapo!',
        icon: '/assets/logo_box.png',
        badge: '/assets/logo_box.png',
        url: '/',
        tag: 'tchapo-general'
    };

    if (event.data) {
        try {
            const parsed = event.data.json();
            data = { ...data, ...parsed };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const notifTag = data.tag || `notif-${Date.now()}`;

    // Deduplicate notifications with identical tags in short windows
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
        icon: data.icon || '/assets/logo_box.png',
        badge: data.badge || '/assets/logo_box.png',
        tag: notifTag,
        renotify: true,
        requireInteraction: true,
        vibrate: data.vibrate || [200, 100, 200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event -> Focus existing tab or open new window
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            const isAdminTarget = targetUrl.includes('admin');
            const isDriverTarget = targetUrl.includes('driver') || targetUrl.includes('entregador');

            for (const client of clientList) {
                const clientUrl = client.url || '';
                const isClientAdmin = clientUrl.includes('admin');
                const isClientDriver = clientUrl.includes('driver') || clientUrl.includes('entregador');

                let matches = false;
                if (isAdminTarget && isClientAdmin) matches = true;
                else if (isDriverTarget && isClientDriver) matches = true;
                else if (!isAdminTarget && !isDriverTarget && !isClientAdmin && !isClientDriver) matches = true;

                if (matches && 'focus' in client) {
                    if (targetUrl && client.url !== targetUrl) {
                        client.navigate(targetUrl);
                    }
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
