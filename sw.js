// Ibernop: service worker (app instalável + notificações). Não guarda dados de clientes.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({ apiKey: 'AIzaSyBAlMWFnh8JM4sVuWjEJhde88AbmNhfv7k', projectId: 'ibernop-7a0d6', messagingSenderId: '345246578720', appId: '1:345246578720:web:d43f2156277ee44257a445' });
firebase.messaging().onBackgroundMessage(p => {
  const d = p.data || {};
  return self.registration.showNotification(d.titulo || 'Ibernop', { body: d.corpo || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || undefined, data: { url: d.url || 'admin.html' } });
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || 'app.html', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if (c.url.split('?')[0] === url.split('?')[0]) return c.focus();
    return clients.openWindow(url);
  }));
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
