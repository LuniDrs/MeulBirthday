(function () {
  "use strict";

  var PHOTOS = ["Mel1.jpeg", "Mel2.jpeg", "Mel3.jpeg", "Mel4.jpeg"];

  var track = null;
  var countEl = null;
  var dots = [];
  var prevBtn = null;
  var nextBtn = null;
  var windowEl = null;
  var index = 0;
  var total = PHOTOS.length;

  function build() {
    var slides = PHOTOS.map(function (name, i) {
      return (
        '<figure class="carousel-slide">' +
        '<img src="assets/mel/' + name + '" alt="Foto ' + (i + 1) + '" loading="lazy" decoding="async">' +
        "</figure>"
      );
    }).join("");

    var dotsHtml = PHOTOS.map(function (_, i) {
      return (
        '<button type="button" class="carousel-dot" data-index="' + i + '" aria-label="Ir para foto ' + (i + 1) + '">' +
        "<span></span>" +
        "</button>"
      );
    }).join("");

    var html =
      '<header class="hero hero--photos">' +
      '<h1 class="hero-title">Galeria</h1>' +
      '<div class="hero-deco" aria-hidden="true"><span>&#10022;</span><span>&#10022;</span><span>&#10022;</span></div>' +
      '<p class="hero-sub">os melhores momentinhos</p>' +
      "</header>" +
      '<section class="carousel" id="carousel" aria-roledescription="carrossel" aria-label="Fotos do aniversário" tabindex="0">' +
      '<div class="carousel-window" id="carousel-window">' +
      '<div class="carousel-track" id="carousel-track">' + slides + "</div>" +
      '<button type="button" class="carousel-arrow carousel-arrow--prev" id="carousel-prev" aria-label="Foto anterior">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>' +
      "</button>" +
      '<button type="button" class="carousel-arrow carousel-arrow--next" id="carousel-next" aria-label="Próxima foto">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>' +
      "</button>" +
      '<span class="carousel-count" id="carousel-count" aria-live="polite"></span>' +
      "</div>" +
      '<div class="carousel-dots" id="carousel-dots">' + dotsHtml + "</div>" +
      "</section>";

    document.getElementById("page").innerHTML = html;

    track = document.getElementById("carousel-track");
    countEl = document.getElementById("carousel-count");
    prevBtn = document.getElementById("carousel-prev");
    nextBtn = document.getElementById("carousel-next");
    windowEl = document.getElementById("carousel-window");
    dots = Array.prototype.slice.call(document.getElementById("carousel-dots").children);
  }

  function preload(i) {
    if (i < 0 || i >= total) {
      return;
    }
    var img = new Image();
    img.src = "assets/mel/" + PHOTOS[i];
  }

  function render() {
    track.style.transform = "translateX(" + -index * 100 + "%)";
    countEl.textContent = index + 1 + " / " + total;
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    preload(index + 1);
    preload(index - 1);
  }

  function goTo(i) {
    if (i < 0 || i >= total) {
      return;
    }
    index = i;
    render();
  }

  build();

  /* interação por toque/mouse (arrastar) */
  var dragging = false;
  var startX = 0;
  var shift = 0;

  windowEl.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }
    dragging = true;
    startX = e.clientX;
    shift = 0;
    windowEl.setPointerCapture(e.pointerId);
    track.classList.add("is-dragging");
  });

  windowEl.addEventListener("pointermove", function (e) {
    if (!dragging) {
      return;
    }
    shift = ((e.clientX - startX) / windowEl.clientWidth) * 100;
    track.style.transform = "translateX(" + (-index * 100 + shift) + "%)";
  });

  function endDrag() {
    if (!dragging) {
      return;
    }
    dragging = false;
    track.classList.remove("is-dragging");
    if (shift <= -8) {
      goTo(index + 1);
    } else if (shift >= 8) {
      goTo(index - 1);
    } else {
      render();
    }
  }

  windowEl.addEventListener("pointerup", endDrag);
  windowEl.addEventListener("pointercancel", endDrag);

  prevBtn.addEventListener("click", function () {
    goTo(index - 1);
  });

  nextBtn.addEventListener("click", function () {
    goTo(index + 1);
  });

  document.getElementById("carousel-dots").addEventListener("click", function (e) {
    var dot = e.target.closest(".carousel-dot");
    if (dot) {
      goTo(Number(dot.getAttribute("data-index")));
    }
  });

  document.getElementById("carousel").addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    }
  });

  render();
})();