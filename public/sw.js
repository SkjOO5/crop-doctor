const CACHE_NAME = "crop-doctor-v1"
const STATIC_ASSETS = ["/", "/manifest.json", "/offline.html"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[v0] Service Worker installing...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[v0] Caching static assets")
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log("[v0] Some assets failed to cache")
      })
    }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[v0] Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[v0] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip API calls (they should handle their own caching)
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          console.log("[v0] API fetch successful:", request.url)
          return response
        })
        .catch(() => {
          console.log("[v0] API fetch failed (offline):", request.url)
          return new Response(JSON.stringify({ error: "Offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
        }),
    )
    return
  }

  // Network first for HTML/JS/CSS
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const cache = caches.open(CACHE_NAME)
          cache.then((c) => c.put(request, response.clone()))
        }
        return response
      })
      .catch(() => {
        console.log("[v0] Serving from cache:", request.url)
        return caches.match(request).then((response) => {
          return response || new Response("Offline - resource not available", { status: 503 })
        })
      }),
  )
})

// Background Sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    console.log("[v0] Background sync triggered")
    event.waitUntil(
      // Notify the app to sync data
      self.clients
        .matchAll()
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "SYNC_DATA" })
          })
        }),
    )
  }
})
