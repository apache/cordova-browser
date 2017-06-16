
// Note, these will be updated automatically at build time
var CACHE_VERSION = '%CACHE_VERSION%';
var CACHE_LIST = ['CACHE_VALUES'];

this.addEventListener('install', function(event) {
    // Perform install steps
    console.log("cordova service worker is installing.");
    event.waitUntil(caches.open(CACHE_VERSION)
    .then(function(cache) {
        return cache.addAll(CACHE_LIST);
    }));
});

this.addEventListener('activate', function(event) {
    // Perform activate steps
    console.log("cordova service worker is activated.");
});

this.addEventListener('fetch', function(event) {
    console.log("cordova service worker : fetch : " + event.request.url);
    event.respondWith(caches.match(event.request));
});
