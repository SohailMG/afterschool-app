if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service Worker registered"))
    .catch(() => console.log("service Worker not registered "));
}
