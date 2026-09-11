const CACHE_NAME = 'nalez-v1'
const STATIC_ASSETS = ['/offline.html', '/icons/192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Cache Nález JSON pre offline
  if (url.pathname.startsWith('/api/nalez/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request)
        try {
          const fresh = await fetch(event.request)
          cache.put(event.request, fresh.clone())
          return fresh
        } catch {
          return cached || new Response(JSON.stringify({ error: 'Offline' }), {
            headers: { 'Content-Type': 'application/json' },
          })
        }
      })
    )
    return
  }

  // Cache statické súbory
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(event.request).then((r) => r || fetch(event.request)))
  }
})

// Web Push notifikácia
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nález', {
      body: data.body || 'Váš audit je pripravený na schválenie.',
      icon: '/icons/192.png',
      badge: '/icons/72.png',
      data: { url: data.url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})
