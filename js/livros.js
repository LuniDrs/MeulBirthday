(function () {
  "use strict";

  var BOOKS = [
    { file: "A Hora da Estrela.jpg", title: "A Hora da Estrela", author: "Clarice Lispector" },
    { file: "A Letra Escarlate.jpg", title: "A Letra Escarlate", author: "Nathaniel Hawthorne" },
    { file: "A Metamorfose.jpg", title: "A Metamorfose", author: "Franz Kafka" },
    { file: "A Quarta Asa.jpg", title: "A Quarta Asa", author: "Rebecca Yarros" },
    { file: "Noites Brancas.jpg", title: "Noites Brancas", author: "Fiódor Dostoiévski" },
    { file: "O Alienista.jpg", title: "O Alienista", author: "Machado de Assis" },
    { file: "O Assassinato De Roger Ackroyd.jpg", title: "O Assassinato de Roger Ackroyd", author: "Agatha Christie" },
    { file: "Pelas Entranhas.webp", title: "Pelas Entranhas", author: "Triz Parizotto" },
    { file: "Quarto de Despejo.jpg", title: "Quarto de Despejo", author: "Carolina Maria de Jesus" },
    { file: "Rádio Silêncio.jpg", title: "Rádio Silêncio", author: "Alice Oseman" },
    { file: "Tudo é Rio.jpg", title: "Tudo é Rio", author: "Carla Madeira" },
    { file: "Um Ano Solitário.jpg", title: "Um Ano Solitário", author: "Alice Oseman" },
    { file: "Um Defeito de Cor.jpg", title: "Um Defeito de Cor", author: "Ana Maria Gonçalves" },
    { file: "Vidas Secas.jpg", title: "Vidas Secas", author: "Graciliano Ramos" }
  ].sort(function (a, b) {
    return a.title.localeCompare(b.title, "pt-BR");
  });

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var cards = BOOKS.map(function (book) {
    var title = escapeHtml(book.title);
    var author = escapeHtml(book.author);
    return (
      '<figure class="book-card">' +
      '<div class="book-cover">' +
      '<img src="' + encodeURI("assets/livros/" + book.file) + '" alt="Capa de ' + title + '" loading="lazy" decoding="async">' +
      "</div>" +
      '<figcaption class="book-info">' +
      '<span class="book-title">' + title + "</span>" +
      '<span class="book-author">' + author + "</span>" +
      "</figcaption>" +
      "</figure>"
    );
  }).join("");

  document.getElementById("page").innerHTML =
    '<header class="hero hero--books">' +
    '<h1 class="hero-title">Livros Favoritos</h1>' +
    '<div class="hero-deco" aria-hidden="true"><span>&#10022;</span><span>&#10022;</span><span>&#10022;</span></div>' +
    '<p class="hero-sub">as leiturinhas preferidas dela</p>' +
    "</header>" +
    '<section class="collection collection--books" aria-label="Livros favoritos">' +
    cards +
    '<div class="hiding-spot" id="books-hiding"></div>' +
    "</section>";

  if (window.MellPuzzle) {
    window.MellPuzzle.mountPiece(document.getElementById("books-hiding"), 0);
  }
})();
