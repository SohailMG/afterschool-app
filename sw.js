const cashName = "afterschool-v1";
const cacheFiles = [
  "index.html",
  "afterschool.webmanifest.json",
  "images/artLogo.png",
  "images/frenchLogo.png",
  "images/mathsLogo.png",
  "images/site_bg.jpg",
  "images/computerLogo.png",
  "images/geographyLogo.png",
  "images/icon-192x192.png",
  "images/icon-512x512.png",
  "images/musicLogo.png",
  "images/spanishLogo.png",
  "images/englishLogo.png",
  "images/historyLogo.png",
  "images/scienceLogo.png",
];

/* caching all files in cache storage  */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cashName).then((cache) => {
      console.log("[SW] -> cashing all files");
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      // Download the file if it is not in the cache,
      return (
        r ||
        fetch(e.request).then(async function (response) {
          // add the new file to cache
          const cache = await caches.open(cashName);
            cache.put(e.request, response.clone());
            return response;
        })
      );
    })
  );
});
