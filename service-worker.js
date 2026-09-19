"use strict";

var CACHE_NAME = "mells-birthday-v3";
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
  "./assets/branding.png"
];

function cachePut(request, response) {
  caches.open(CACHE_NAME).then(function (cache) {
    cache.put(request, response);
  });
}

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
          if (response) {
            cachePut(request, response.clone());
          }
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match("./index.html");
          });
        })
    );
    return;
  }

  if (request.destination === "script" || request.destination === "style" || request.destination === "font" || request.destination === "manifest") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response) {
            cachePut(request, response.clone());
          }
          return response;
        })
        .catch(function () {
          return caches.match(request);
        })
    );
    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then(function (cached) {
        var network = fetch(request)
          .then(function (response) {
            if (response) {
              cachePut(request, response.clone());
            }
            return response;
          })
          .catch(function () {
            return cached;
          });
        return cached || network;
      })
    );
    return;
  }
});