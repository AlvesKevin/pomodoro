const CACHE_NAME = 'pomodoro-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/timer.js',
  '/js/projects.js',
  '/js/tasks.js',
  '/js/ui.js',
  '/js/storage.js',
  '/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error(`Failed to cache ${url}: ${err}`);
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
