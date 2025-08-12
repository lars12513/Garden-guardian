self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Garden Guardian'
  const options = {
    body: data.body || 'Påminnelse',
    data: data,
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
