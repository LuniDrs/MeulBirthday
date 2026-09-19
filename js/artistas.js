(function () {
  "use strict";

  var ARTISTS = [
    { file: "Clarice Falcão.jpg", name: "Clarice Falcão" },
    { file: "Kamaitachi.jpg", name: "Kamaitachi" },
    { file: "Lagum.webp", name: "Lagum" },
    { file: "Supercombo.avif", name: "Supercombo" }
  ].sort(function (a, b) {
    return a.name.localeCompare(b.name, "pt-BR");
  });

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var cards = ARTISTS.map(function (artist) {
    var name = escapeHtml(artist.name);
    return (
      '<figure class="artist-card">' +
      '<div class="artist-photo">' +
      '<img src="' + encodeURI("assets/artistas/" + artist.file) + '" alt="' + name + '" loading="lazy" decoding="async">' +
      "</div>" +
      '<figcaption class="artist-name">' + name + "</figcaption>" +
      "</figure>"
    );
  }).join("");

  document.getElementById("page").innerHTML =
    '<header class="hero hero--artists">' +
    '<h1 class="hero-title">Artistas Favoritos</h1>' +
    '<div class="hero-deco" aria-hidden="true"><span>&#10022;</span><span>&#10022;</span><span>&#10022;</span></div>' +
    '<p class="hero-sub">a trilha sonora dela</p>' +
    "</header>" +
    '<section class="collection collection--artists" aria-label="Artistas favoritos">' +
    cards +
    '<div class="hiding-spot" id="artists-hiding"></div>' +
    "</section>";

  if (window.MellPuzzle) {
    window.MellPuzzle.mountPiece(document.getElementById("artists-hiding"), 1);
  }
})();
