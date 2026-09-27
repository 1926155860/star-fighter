/* 星际战机 PWA Service Worker（P22-⑱⑲）：单文件离线包缓存 */
var CACHE = 'star-fighter-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(['./']).catch(function () {});
    }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (url.indexOf('npoint.io') !== -1 || url.indexOf('api.github.com') !== -1) return; // 云请求不缓存
  e.respondWith(
    fetch(e.request).then(function (r) {
      var cp = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, cp); }).catch(function () {});
      return r;
    }).catch(function () {
      return caches.match(e.request).then(function (m) { return m || caches.match('./'); });
    })
  );
});
