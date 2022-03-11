const CACHE_NAME = "afterschool-v1";
const CACHE_URLS = [
  "./index.html",
  "./manifest.json",
  "./images/artLogo.png",
  "./images/frenchLogo.png",
  "./images/mathsLogo.png",
  "./images/site_bg.jpg",
  "./images/computerLogo.png",
  "./images/geographyLogo.png",
  "./images/icon-192x192.png",
  "./images/icon-512x512.png",
  "./images/musicLogo.png",
  "./images/spanishLogo.png",
  "./images/englishLogo.png",
  "./images/historyLogo.png",
  "./images/scienceLogo.png",
];

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  console.log("fetch request to => " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return (
        r ||
        fetch(e.request).then(async function (response) {
          // add the new file to cache
          const cache = await caches.open(CACHE_NAME);
          cache.put(e.request, response.clone());
          return response;
        })
      );
    })
  );
});

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Installing cache => " + CACHE_NAME);
      return cache.addAll(CACHE_URLS);
    })
  );
});
