/* GTA6Guide – Countdown & Navigation */

(function () {
  "use strict";

  /* Countdown zum Release: 19. November 2026, 00:00 lokale Zeit.
     Sobald Rockstar die Unlock-Zeit nennt, hier anpassen. */
  const TARGET = new Date(2026, 10, 19, 0, 0, 0);

  const el = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
    wrap: document.getElementById("countdown"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = TARGET - new Date();

    if (diff <= 0) {
      el.wrap.innerHTML =
        '<p class="cd-live">GTA VI ist da! 🎉</p>';
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    el.days.textContent = d;
    el.hours.textContent = pad(h);
    el.mins.textContent = pad(m);
    el.secs.textContent = pad(s);
  }

  let timer = null;
  if (el.wrap && el.days) {
    tick();
    timer = setInterval(tick, 1000);
  }

  /* Aktiven Nav-Link markieren */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
})();
