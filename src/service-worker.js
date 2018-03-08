/* eslint-disable no-restricted-globals */

// Name our cache
const CACHE_NAME_STATIC = 'static-v1'
const CACHE_NAME_DYNAMIC = 'dynamic-v1'

self.addEventListener('activate', event => {
  // Delete old caches that are not our current one!
  const cacheWhitelist = [CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC]
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => { // eslint-disable-line
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key)
          }
        }),
      ),
    ),
  )
  // immediately start serving fetch events
  event.waitUntil(self.clients.claim())
})

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        // following filenames are hashed
        // 'index.js',
        // 'images/nogoals.svg',
        // 'images/avatar-doge.png',
        // 'images/avatar-mage.png',
        // 'images/avatar-morpheus.png',
        // 'images/avatar-neo.png',
        // 'images/avatar-paesant.png',
        'https://fonts.googleapis.com/css?family=Roboto',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
      ])
    }),
  )
})

// When the webpage goes to fetch files, we intercept that request and serve up the matching files if we have them
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request).then(res =>
        caches.open(CACHE_NAME_DYNAMIC).then(cache => {
          cache.put(event.request.url, res.clone())
          return res
        }),
      )
    }),
  )
})
