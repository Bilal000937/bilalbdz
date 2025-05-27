/* eslint-disable no-restricted-globals */

// Installation du service worker
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

// Gestion des notifications push
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Ouvrir'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // Si une fenêtre est déjà ouverte, la focus et navigue
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          client.navigate(urlToOpen);
          return;
        }
      }
      // Sinon, ouvre une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
