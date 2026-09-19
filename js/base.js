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

  var chrome =
    '<nav class="navbar" aria-label="Navegação principal">' +
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
    '<ul class="guest-list">' + guestRows + "</ul>" +
    "</div>" +
    "</aside>" +
    '<div class="stars-bg" id="stars-bg" aria-hidden="true"></div>';

  var tail =
    '<footer class="site-footer" id="site-footer">' +
    '<div class="foot-stars" aria-hidden="true"></div>' +
    '<div class="foot-inner">' +
    '<p class="foot-wish">Feliz aniversário, Mel.</p>' +
    '<p class="foot-date">19/09/2026</p>' +
    "</div>" +
    "</footer>" +
    '<div class="clock-fixed" id="clock-fixed" role="status" aria-live="off"></div>';

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