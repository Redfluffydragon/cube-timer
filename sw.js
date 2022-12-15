let APP_PREFIX = 'cube-timer_';

let VERSION = '1.1.0.0';

let CACHE_NAME = APP_PREFIX + VERSION;

let URLS = [
  '/cube-timer/',
  '/cube-timer/index.html',
  '/cube-timer/timer.css',
  '/cube-timer/timer-min.js',
  '/cube-timer/img/icon16x16.png',
  '/cube-timer/img/undoicon.png',
  '/cube-timer/img/settingsicon.png',
  '/cube-timer/img/lightmode.png',
  '/cube-timer/img/infoicon.png',
  '/cube-timer/sound/eight.mp3',
  '/cube-timer/sound/twelve.mp3',
];

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      return request || fetch(e.request)
    })
  );
}, false);

self.addEventListener('install', e => {
  e.waitUntil (
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS);
    })
  );
}, false);

self.addEventListener('activate', e => {
  e.waitUntil (
    caches.keys().then(keyList => {
      let cacheWhitelist = keyList.filter(key =>{
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map((key, i) => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
}, false);
