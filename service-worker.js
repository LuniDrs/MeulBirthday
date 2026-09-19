"use strict";

var CACHE_NAME = "mells-birthday-v2";
var APP_SHELL = [
  "./",
  "./index.html",
  "./photos.html",
  "./manifest.webmanifest",
  "./css/base.css",
  "./css/index.css",
  "./css/photos.css",
  "./js/base.js",
  "./js/index.js",
  "./js/photos.js",
  "./assets/icon-192.png",
  "./assets/branding.png",
  "./assets/pikura-star-20750_512.gif",
  "./assets/estrela.png",
  "./assets/brilhar.png",
  "./assets/meia-lua.png",
  "./assets/galaxia.png",
  "./assets/mel/Mel1.jpeg",
  "./assets/mel/Mel2.jpeg",
  "./assets/mel/Mel3.jpeg",
  "./assets/mel/Mel4.jpeg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") {
    return;
  }

  var url = new URL(request.url);

  if (url.origin !== location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
            return response;
          });
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match("./index.html");
          });
        })
    );
    return;
  }

  if (request.destination === "image" || request.destination === "font" || request.destination === "script" || request.destination === "style") {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) {
          return cached;
        }
        return fetch(request).then(function (response) {
          if (response) {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        });
      })
    );
    return;
  }
});