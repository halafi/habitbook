/* eslint-disable no-restricted-globals */

// Set this to true for production
// if (process.evn)
const doCache = true

// Name our cache
const CACHE_NAME = 'static'

// Delete old caches that are not our current one!
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          // eslint-disable-line
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key)
          }
        }),
      ),
    ),
  )
})

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', event => {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        cache.addAll([
          '/',
          'index.html',
          'index.js',
          'images/nogoals.svg',
          'images/avatar-doge.png',
          'images/avatar-mage.png',
          'images/avatar-morpheus.png',
          'images/avatar-neo.png',
          'images/avatar-paesant.png',
          'https://fonts.googleapis.com/css?family=Roboto',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
        ])
      }),
    )
  }
})

// When the webpage goes to fetch files, we intercept that request and serve up the matching files if we have them
self.addEventListener('fetch', event => {
  if (doCache) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response
        }
        return fetch(event.request).then(res =>
          caches.open('dynamic').then(cache => {
            cache.put(event.request.url, res.clone())
            return res
          }),
        )
      }),
    )
  }
})
