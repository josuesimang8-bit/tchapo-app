// Tchapo Tchapo Universal Web Push & Notification Service
// Standards-compliant (Push API, Service Worker, Notification API & Web Audio API)

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Web Audio API synthesizer for modern, beautiful, cross-platform notification chimes.
 * Requires zero external audio files — 100% reliable without missing assets or network delay.
 */
export function playNotificationChime(type = 'default') {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const now = ctx.currentTime;

        if (type === 'order' || type === 'success') {
            // Cheerful two-tone chime (D5 -> A5)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now);
            gain1.gain.setValueAtTime(0.25, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.35);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now + 0.12);
            gain2.gain.setValueAtTime(0.3, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.65);
        } else if (type === 'driver' || type === 'alert') {
            // Attention-grabbing three-tone chime for drivers
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const startTime = now + (idx * 0.1);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.28, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 0.4);
            });
        } else {
            // Subtle single ping
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(659.25, now); // E5
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (_) {
        // Silently catch audio policy blocks
    }
}

/**
 * Check if the browser supports standard Web Push & Notifications
 */
export function isNotificationSupported() {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission
 */
export function getNotificationPermission() {
    if (!isNotificationSupported()) return 'unsupported';
    return Notification.permission;
}

/**
 * Convert URL-safe base64 string to Uint8Array for VAPID applicationServerKey
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    try {
        let permission;
        const p = Notification.requestPermission((res) => {
            if (res) permission = res;
        });
        if (p && typeof p.then === 'function') {
            permission = await p;
        }
        return permission || Notification.permission;
    } catch (e) {
        return Notification.permission || 'denied';
    }
}

/**
 * Register Service Worker and subscribe user to Web Push Notifications
 */
export async function subscribeToPush({
    role = 'customer',
    phone = '',
    userId = null,
    orderId = null,
    driverId = null,
    province = '',
    bairro = ''
} = {}) {
    if (!isNotificationSupported()) {
        return { success: false, reason: 'unsupported' };
    }

    try {
        const perm = await requestNotificationPermission();
        if (perm !== 'granted') {
            return { success: false, reason: 'permission_' + perm };
        }

        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // Fetch VAPID public key from backend
        let publicKey = '';
        try {
            const keyRes = await fetch(`${API_URL}/api/vapid-public-key`);
            if (keyRes.ok) {
                const data = await keyRes.json();
                publicKey = data.publicKey;
            }
        } catch (_) {}

        if (!publicKey) {
            // Fallback to default key if server didn't respond
            publicKey = 'BAxlp2zq_g-ExdDWsJUsC6z1FWpSg6L-ysw64w_ouuJtselkPdEvPbo3yH9BBddaRzPbvTQGqyE7MS36Ns1ygvM';
        }

        const convertedVapidKey = urlBase64ToUint8Array(publicKey);

        let subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
            subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });
        }

        // Persist to backend database / file
        const subRes = await fetch(`${API_URL}/api/notifications/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscription,
                role,
                phone,
                user_id: userId,
                order_id: orderId,
                driver_id: driverId,
                province,
                bairro
            })
        });

        if (subRes.ok) {
            localStorage.setItem('tchapo_push_subscribed', 'true');
            localStorage.setItem('tchapo_push_role', role);
            if (phone) localStorage.setItem('tchapo_push_phone', phone);
            return { success: true, subscription };
        }

        return { success: true, subscription };
    } catch (err) {
        console.warn('[PushService] Subscription failed:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Trigger an immediate notification on the device (Web Notification + Audio Chime + Vibration)
 * Works seamlessly whether app is open or in background tab.
 */
export async function triggerDeviceNotification({
    title,
    body,
    icon = '/assets/logo_box.png',
    badge = '/assets/logo_box.png',
    url = '/',
    tag = `notif-${Date.now()}`,
    chime = 'order'
}) {
    // 1. Play synthesized chime
    if (chime) {
        playNotificationChime(chime);
    }

    // 2. Trigger vibration if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
            navigator.vibrate([200, 100, 200]);
        } catch (_) {}
    }

    // 3. Show System Notification if permission is granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
            if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg) {
                    await reg.showNotification(title, {
                        body,
                        icon,
                        badge,
                        tag,
                        requireInteraction: true,
                        data: { url }
                    });
                    return true;
                }
            }
            // Fallback to standard window Notification
            const notif = new Notification(title, {
                body,
                icon,
                tag
            });
            notif.onclick = () => {
                window.focus();
                if (url && url !== '/') {
                    window.location.href = url;
                }
            };
            return true;
        } catch (e) {
            console.warn('[DeviceNotification] Error showing notification:', e);
        }
    }
    return false;
}
