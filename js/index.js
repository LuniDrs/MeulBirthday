(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".event-card"));

  if (!cards.length) {
    return;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function nowMins() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  var SCHED_START = 8 * 60;
  var SCHED_END = 18 * 60;

  var timeline = document.getElementById("timeline");
  var pointer = timeline.querySelector(".timeline-pointer");
  var pointerChip = document.getElementById("pointer-chip");
  var dragging = false;
  var grabOffset = 0;

  function maxPointerY() {
    return Math.max(0, timeline.clientHeight - pointer.offsetHeight);
  }

  function formatMins(m) {
    var total = Math.floor(m);
    return pad(Math.floor(total / 60)) + ":" + pad(total % 60);
  }

  function applyActive(mins) {
    cards.forEach(function (card) {
      var start = card.dataset.start.split(":").map(Number);
      var end = card.dataset.end.split(":").map(Number);
      var s = start[0] * 60 + start[1];
      var e = end[0] * 60 + end[1];
      card.classList.toggle("is-active", mins >= s && mins < e);
    });
  }

  function placePointer(progress) {
    pointer.style.transform = "translate(-50%, " + progress * maxPointerY() + "px)";
  }

  function applyTimeline(mins, animate) {
    pointer.classList.toggle("is-dragging", !animate);
    var progress = clamp((mins - SCHED_START) / (SCHED_END - SCHED_START), 0, 1);
    placePointer(progress);
    pointerChip.textContent = formatMins(mins);
    applyActive(mins);
  }

  function liveTick() {
    if (dragging) {
      return;
    }
    applyTimeline(nowMins(), true);
  }

  pointer.addEventListener("pointerdown", function (e) {
    dragging = true;
    grabOffset = e.clientY - pointer.getBoundingClientRect().top;
    pointer.classList.add("is-dragging");
    pointer.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  pointer.addEventListener("pointermove", function (e) {
    if (!dragging) {
      return;
    }
    var tlRect = timeline.getBoundingClientRect();
    var maxY = maxPointerY();
    var y = clamp(e.clientY - tlRect.top - grabOffset, 0, maxY);
    var progress = maxY > 0 ? y / maxY : 0;
    var mins = SCHED_START + progress * (SCHED_END - SCHED_START);
    placePointer(progress);
    pointerChip.textContent = formatMins(mins);
    applyActive(mins);
  });

  function endDrag() {
    if (!dragging) {
      return;
    }
    dragging = false;
    pointer.classList.remove("is-dragging");
    applyTimeline(nowMins(), true);
  }

  pointer.addEventListener("pointerup", endDrag);
  pointer.addEventListener("pointercancel", endDrag);

  cards.forEach(function (card) {
    var head = card.querySelector(".event-head");
    head.addEventListener("click", function () {
      var collapsed = card.classList.toggle("is-collapsed");
      head.setAttribute("aria-expanded", String(!collapsed));
    });
  });

  if ("IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveal.observe(document.querySelector(".hero"));
    cards.forEach(function (card) {
      reveal.observe(card);
    });
  } else {
    cards.forEach(function (card) {
      card.classList.add("is-in");
    });
    document.querySelector(".hero").classList.add("is-in");
  }

  applyTimeline(nowMins(), true);
  setInterval(liveTick, 1000);

  window.addEventListener("resize", function () {
    if (!dragging) {
      placePointer(clamp((nowMins() - SCHED_START) / (SCHED_END - SCHED_START), 0, 1));
    }
  });
})();