(function () {
  "use strict";

  var GUESTS = ["Brey", "Jay", "Kemi", "Luan", "Luni", "Sales", "Vincent", "Yan"].sort();

  var PALETTE = [35, 42, 50, 57, 210, 222, 236, 252, 268, 284];

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function avatarColor(name) {
    var h = hashStr(name);
    var hue = PALETTE[h % PALETTE.length];
    var sat = 58 + (h % 18);
    var light = 46 + (h % 12);
    return "hsl(" + hue + "," + sat + "%," + light + "%)";
  }

  var guestRows = GUESTS.map(function (name) {
    return (
      '<li class="guest">' +
      '<span class="guest-avatar" style="background:' + avatarColor(name) + '">' + name.charAt(0) + "</span>" +
      '<span class="guest-name">' + name + "</span>" +
      "</li>"
    );
  }).join("");

  var SPECIAL_GUESTS = [
    { name: "A Magistrada", file: "assets/amagistrada.png" },
    { name: "O Anfitrião", file: "assets/oanfitrião.png" },
    { name: "O Deus Da Morte", file: "assets/odeusdamorte.png" },
    { name: "O Diabo", file: "assets/odiabo.png" }
  ].sort(function (a, b) {
    return a.name.localeCompare(b.name, "pt-BR");
  });

  var specialRows = SPECIAL_GUESTS.map(function (guest) {
    return (
      '<li class="guest guest--special">' +
      '<span class="guest-avatar guest-avatar--photo">' +
      '<img src="' + encodeURI(guest.file) + '" alt="" loading="lazy" decoding="async">' +
      "</span>" +
      '<span class="guest-name">' + guest.name + "</span>" +
      "</li>"
    );
  }).join("");

  var PAGE = /photos\.html$/i.test(location.pathname)
    ? "photos"
    : /livros\.html$/i.test(location.pathname)
      ? "livros"
      : /artistas\.html$/i.test(location.pathname)
        ? "artistas"
        : "home";

  var ICONS = {
    photos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 9.3c0-.97.78-1.75 1.75-1.75h1.9l1.32-1.86A1.75 1.75 0 0 1 10 4.92h4.01c.62 0 1.21.32 1.53.78L16.86 7.55h1.9c.97 0 1.75.78 1.75 1.75v8.1c0 .97-.78 1.75-1.75 1.75H5.25c-.97 0-1.75-.78-1.75-1.75V9.3Z"/><circle cx="12" cy="13.05" r="3.1"/></svg>',
    livros: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    artistas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>'
  };

  var NAV_LINKS = [
    { page: "photos", href: "photos.html", label: "Fotos" },
    { page: "livros", href: "livros.html", label: "Livros favoritos" },
    { page: "artistas", href: "artistas.html", label: "Artistas favoritos" }
  ];

  var navActions =
    '<div class="nav-actions">' +
    NAV_LINKS.map(function (item) {
      return (
        '<a class="nav-icon' + (item.page === PAGE ? " is-active" : "") + '" href="' + item.href + '" aria-label="' + item.label + '" title="' + item.label + '">' +
        ICONS[item.page] +
        "</a>"
      );
    }).join("") +
    "</div>";

  var chrome =
    '<nav class="navbar" aria-label="Navegação principal">' +
    navActions +
    '<div class="nav-stars" aria-hidden="true"></div>' +
    '<span class="nav-shoot" style="--y:18%;--d:4.6s;--delay:0s" aria-hidden="true"></span>' +
    '<span class="nav-shoot" style="--y:52%;--d:5.8s;--delay:1.7s" aria-hidden="true"></span>' +
    '<span class="nav-shoot" style="--y:78%;--d:6.4s;--delay:3.4s" aria-hidden="true"></span>' +
    '<a class="nav-logo" href="index.html" aria-label="Mell\'s Birthday">' +
    '<img src="assets/pikura-star-20750_512.gif" alt="Estrela girando">' +
    '<span class="nav-brand-text">Mell\'s Birthday</span>' +
    "</a>" +
    '<button type="button" class="menu-toggle" id="menu-toggle" aria-label="Abrir menu de convidados" aria-controls="menu-panel" aria-expanded="false">' +
    "<span></span><span></span><span></span>" +
    "</button>" +
    "</nav>" +
    '<div class="menu-backdrop" id="menu-backdrop" aria-hidden="true"></div>' +
    '<aside class="menu-panel" id="menu-panel" aria-label="Convidados" aria-hidden="true">' +
    '<div class="menu-head">' +
    '<div class="menu-brand">' +
    '<img src="assets/pikura-star-20750_512.gif" alt="">' +
    "<h2>Mell's Birthday</h2>" +
    "</div>" +
    '<div class="menu-clock" id="clock-menu" role="status" aria-live="off"></div>' +
    '<button type="button" class="menu-close" id="menu-close" aria-label="Fechar menu">\u00d7</button>' +
    "</div>" +
    '<div class="menu-body">' +
    '<p class="menu-eyebrow">os poucos e bons</p>' +
    '<h3 class="menu-title">Convidados</h3>' +
    '<ul class="guest-list">' + guestRows + specialRows + "</ul>" +
    '<div class="menu-puzzle" id="menu-puzzle"></div>' +
    "</div>" +
    "</aside>" +
    '<div class="stars-bg" id="stars-bg" aria-hidden="true"></div>';

  var frameHtml =
    PAGE === "home"
      ? '<div class="puzzle-frame" id="puzzle-frame" hidden>' +
        '<button type="button" class="puzzle-board" id="puzzle-board" aria-label="Puzzle dos Seasons">' +
        '<span class="puzzle-cell" data-q="0"></span>' +
        '<span class="puzzle-cell" data-q="1"></span>' +
        '<span class="puzzle-cell" data-q="2"></span>' +
        '<span class="puzzle-cell" data-q="3"></span>' +
        '<img class="puzzle-cube" src="assets/cube.gif" alt="Cubo girando">' +
        "</button>" +
        "</div>"
      : "";

  var tail =
    '<div class="clock-stack" id="clock-stack">' +
    '<div class="clock-timer" id="clock-timer" role="status" aria-live="off"></div>' +
    '<div class="clock-fixed" id="clock-fixed" role="status" aria-live="off"></div>' +
    "</div>" +
    '<footer class="site-footer" id="site-footer">' +
    '<div class="foot-stars" aria-hidden="true"></div>' +
    '<div class="foot-inner">' +
    '<p class="foot-wish">Feliz aniversário, Mel.</p>' +
    '<p class="foot-date">19/09/2026</p>' +
    "</div>" +
    frameHtml +
    "</footer>";

  document.body.insertAdjacentHTML("afterbegin", chrome);
  document.body.insertAdjacentHTML("beforeend", tail);

  var mobile = window.innerWidth <= 640;

  function makeStars(container, count, modifier) {
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "star" + (modifier ? " " + modifier : "");
      var size =
        modifier === "star--nav"
          ? 14 + Math.random() * 12
          : modifier === "star--foot"
            ? 12 + Math.random() * 14
            : mobile
              ? 16 + Math.random() * 18
              : 20 + Math.random() * 40;
      s.style.cssText =
        "left:" + (Math.random() * 100).toFixed(2) + "%;" +
        "top:" + (modifier === "star--nav" ? 8 + Math.random() * 72 : Math.random() * 100).toFixed(2) + "%;" +
        "width:" + size.toFixed(1) + "px;" +
        "height:" + size.toFixed(1) + "px;" +
        "--dur:" + (2.2 + Math.random() * 3).toFixed(2) + "s;" +
        "animation-delay:" + (-Math.random() * 6).toFixed(2) + "s";
      container.appendChild(s);
    }
  }

  function bgStarCount() {
    var w = window.innerWidth;
    if (w <= 480) {
      return 6;
    }
    if (w <= 768) {
      return 12;
    }
    return 42;
  }

  makeStars(document.getElementById("stars-bg"), bgStarCount(), "");
  makeStars(document.querySelector(".nav-stars"), 6, "star--nav");
  makeStars(document.querySelector(".foot-stars"), mobile ? 7 : 12, "star--foot");

  var toggle = document.getElementById("menu-toggle");
  var panel = document.getElementById("menu-panel");
  var backdrop = document.getElementById("menu-backdrop");
  var closeBtn = document.getElementById("menu-close");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
  }

  toggle.addEventListener("click", function () {
    setMenu(true);
  });

  closeBtn.addEventListener("click", function () {
    setMenu(false);
  });

  backdrop.addEventListener("click", function () {
    setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setMenu(false);
    }
  });

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  var clockFixed = document.getElementById("clock-fixed");
  var clockMenu = document.getElementById("clock-menu");

  function renderClock() {
    var d = new Date();
    var time = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    var date = pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
    var html = '<span class="c-time">' + time + "</span><span class=\"c-date\">" + date + "</span>";
    clockFixed.innerHTML = html;
    clockMenu.innerHTML = html;
  }

  renderClock();
  setInterval(renderClock, 1000);

  var clockTimer = document.getElementById("clock-timer");
  var partyStart = new Date(2026, 8, 19, 8, 0, 0).getTime();

  function renderCountdown() {
    var diff = partyStart - Date.now();
    var text;

    if (diff <= 0) {
      text = "Começou! :3";
    } else {
      var totalMin = Math.floor(diff / 60000);
      var h = Math.floor(totalMin / 60);
      var m = totalMin % 60;
      if (h >= 1) {
        text = "Faltam " + h + (h === 1 ? " hora" : " horas") + " e " + m + " min";
      } else {
        var s = Math.floor((diff % 60000) / 1000);
        text = "Faltam " + m + " min e " + s + "s";
      }
    }

    clockTimer.textContent = text;
  }

  renderCountdown();
  setInterval(renderCountdown, 1000);

  /* ---------- Puzzle dos Seasons ---------- */
  var SEASONS = [
    "assets/seasons/Auttumn.png",
    "assets/seasons/Blueprint.png",
    "assets/seasons/Captura de tela 2026-09-18 234519.png",
    "assets/seasons/Summer.png"
  ];
  var PUZZLE_KEY = "mell-seasons-puzzle";
  var QUAD_POS = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];

  function isReload() {
    try {
      var entries = performance.getEntriesByType && performance.getEntriesByType("navigation");
      if (entries && entries.length) {
        return entries[0].type === "reload";
      }
      return performance.navigation && performance.navigation.type === 1;
    } catch (e) {
      return false;
    }
  }

  function savePuzzle() {
    try {
      sessionStorage.setItem(PUZZLE_KEY, JSON.stringify(puzzle));
    } catch (e) {}
  }

  var puzzle = null;
  try {
    puzzle = JSON.parse(sessionStorage.getItem(PUZZLE_KEY));
  } catch (e) {}

  if (!puzzle || typeof puzzle.photo !== "number" || !Array.isArray(puzzle.found)) {
    puzzle = {
      photo: Math.floor(Math.random() * SEASONS.length),
      found: [false, false, false, false],
      solved: false
    };
  } else if (isReload()) {
    puzzle.photo = (puzzle.photo + 1) % SEASONS.length;
    puzzle.found = [false, false, false, false];
    puzzle.solved = false;
  }

  if (typeof puzzle.solved !== "boolean") {
    puzzle.solved = false;
  }

  savePuzzle();

  var seasonUrl = encodeURI(SEASONS[puzzle.photo]);

  (function measureSeason() {
    var probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth && probe.naturalHeight) {
        document.documentElement.style.setProperty(
          "--season-aspect",
          (probe.naturalWidth / probe.naturalHeight).toFixed(4)
        );
      }
    };
    probe.src = seasonUrl;
  })();

  function foundCount() {
    return puzzle.found.filter(Boolean).length;
  }

  var puzzleFrame = document.getElementById("puzzle-frame");
  var puzzleBoard = document.getElementById("puzzle-board");
  var puzzleCells = puzzleBoard ? Array.prototype.slice.call(puzzleBoard.querySelectorAll(".puzzle-cell")) : [];

  function renderPuzzleFrame() {
    if (!puzzleFrame || !puzzleBoard) {
      return;
    }
    puzzleFrame.hidden = foundCount() === 0;
    puzzleCells.forEach(function (cell, i) {
      cell.style.backgroundImage = "url('" + seasonUrl + "')";
      cell.style.backgroundSize = "200% 200%";
      cell.style.backgroundPosition = QUAD_POS[i];
      cell.classList.toggle("is-found", puzzle.found[i]);
    });
    if (foundCount() === 4 && !puzzle.solved) {
      puzzleBoard.classList.add("is-complete");
    }
    if (puzzle.solved) {
      puzzleBoard.classList.add("is-solved");
      puzzleFrame.classList.add("is-solved");
    }
  }

  function collectPiece(quadrant, el) {
    if (puzzle.found[quadrant]) {
      return;
    }
    puzzle.found[quadrant] = true;
    savePuzzle();
    el.classList.add("is-collected");
    el.disabled = true;
    window.setTimeout(function () {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 2800);
    renderPuzzleFrame();
  }

  function mountPiece(parent, quadrant) {
    if (!parent || puzzle.found[quadrant]) {
      return;
    }
    var el = document.createElement("button");
    el.type = "button";
    el.className = "puzzle-piece";
    el.setAttribute("aria-label", "Um pedacinho escondido dos Seasons");
    el.title = "Um pedacinho escondido...";
    el.style.backgroundImage = "url('" + seasonUrl + "')";
    el.style.backgroundSize = "200% 200%";
    el.style.backgroundPosition = QUAD_POS[quadrant];
    el.addEventListener("click", function () {
      collectPiece(quadrant, el);
    });
    parent.appendChild(el);
  }

  if (puzzleBoard) {
    puzzleBoard.addEventListener("click", function () {
      if (puzzle.solved || foundCount() < 4) {
        return;
      }
      puzzle.solved = true;
      savePuzzle();
      puzzleBoard.classList.add("is-solved");
      puzzleFrame.classList.add("is-solved");
    });
  }

  renderPuzzleFrame();
  mountPiece(document.getElementById("menu-puzzle"), 2);

  window.MellPuzzle = { mountPiece: mountPiece };

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js", { updateViaCache: "none" }).catch(function () {});
    });

    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (window.sessionStorage.getItem("sw-refreshed")) {
        return;
      }
      window.sessionStorage.setItem("sw-refreshed", "1");
      window.location.reload();
    });
  }

  var footer = document.getElementById("site-footer");

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            footer.classList.add("is-in");
            observer.unobserve(footer);
          }
        });
      },
      { threshold: 0.12 }
    ).observe(footer);
  } else {
    footer.classList.add("is-in");
  }
})();