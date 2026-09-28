// Screenshot galleries, the image viewer and a small fade-in on scroll.
(function () {
  "use strict";

  var galleries = {
    superbug: [
      ["images/projects/superbug-banner.webp", "Superbug title screen"],
      ["images/projects/superbug-cover.webp", "Superbug cover art"]
    ],
    scoundrel: [
      ["images/projects/scoundrel-1.webp", "Shop between floors"],
      ["images/projects/scoundrel-2.webp", "A room with a weapon equipped"],
      ["images/projects/scoundrel-3.webp", "A room with no weapon equipped"]
    ],
    mtg: [
      ["images/projects/mtg-board.webp", "Four-player Commander game"],
      ["images/projects/mtg-menu.webp", "Game modes"],
      ["images/projects/mtg-setup.webp", "Game setup"]
    ],
    up: [
      ["images/projects/up-4.webp", "Office corridor with enemy robots"],
      ["images/projects/up-5.webp", "A wall broken open in the corridor"],
      ["images/projects/up-3.webp", "Office level, collecting items"],
      ["images/projects/up-2.webp", "Main menu, shown on the phone's screen"],
      ["images/projects/up-1.webp", "Difficulty select"]
    ],
    vh: [
      ["images/projects/vh-1.webp", "Cave above lava"],
      ["images/projects/vh-2.webp", "Flooded ruins"]
    ],
    loc: [
      ["images/projects/loc-1.webp", "Moving a unit"],
      ["images/projects/loc-2.webp", "Combat preview"],
      ["images/projects/loc-5.webp", "Recruiting units"],
      ["images/projects/loc-4.webp", "Match setup"],
      ["images/projects/loc-3.webp", "Title screen"]
    ],
    newsdle: [
      ["images/projects/newsdle-5.webp", "Reviewing an article"],
      ["images/projects/newsdle-4.webp", "Checking a graph"],
      ["images/projects/newsdle-3.webp", "News feed at the end of day 1, with reader comments"],
      ["images/projects/newsdle-1.webp", "Result of a fact-check review"],
      ["images/projects/newsdle-2.webp", "The chief editor's briefing for day 1"]
    ]
  };

  document.documentElement.classList.add("js");

  // Thumbnail strips under the main image.
  document.querySelectorAll(".thumbs").forEach(function (strip) {
    var name = strip.dataset.gallery;
    galleries[name].forEach(function (item, i) {
      if (i === 0) return;
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.gallery = name;
      b.dataset.index = i;
      b.setAttribute("aria-label", item[1]);
      b.innerHTML = '<img src="' + item[0] + '" alt="" loading="lazy">';
      strip.appendChild(b);
    });
  });

  // Viewer
  var viewer = document.querySelector(".viewer");
  var vImg = viewer.querySelector("img");
  var vCap = viewer.querySelector("figcaption");
  var current = null;
  var index = 0;

  function show() {
    var item = galleries[current][index];
    vImg.src = item[0];
    vImg.alt = item[1];
    vCap.textContent = item[1] + " (" + (index + 1) + "/" + galleries[current].length + ")";
    var many = galleries[current].length > 1;
    viewer.querySelector(".v-prev").hidden = !many;
    viewer.querySelector(".v-next").hidden = !many;
  }
  function step(d) {
    var n = galleries[current].length;
    index = (index + d + n) % n;
    show();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-gallery][data-index]");
    if (!trigger) return;
    current = trigger.dataset.gallery;
    index = Number(trigger.dataset.index);
    show();
    viewer.showModal();
  });
  viewer.querySelector(".v-close").addEventListener("click", function () { viewer.close(); });
  viewer.querySelector(".v-prev").addEventListener("click", function () { step(-1); });
  viewer.querySelector(".v-next").addEventListener("click", function () { step(1); });
  viewer.addEventListener("click", function (e) {
    if (e.target === viewer) viewer.close();
  });
  viewer.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  var touchX = null;
  viewer.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  // Header border once the page is scrolled.
  var top = document.querySelector(".top");
  function onScroll() { top.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Fade sections in as they enter the viewport.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("shown");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll(".fade, .project").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".fade, .project").forEach(function (el) { el.classList.add("shown"); });
  }
})();
