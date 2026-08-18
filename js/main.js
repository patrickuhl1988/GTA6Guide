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

  /* News rendern (zentrale Datenquelle: js/news-data.js) */
  function newsCard(item) {
    var badge = item.badge === "official"
      ? '<span class="badge badge-official">Offiziell</span>'
      : '<span class="badge badge-rumor">Gerücht</span>';
    var link = item.url
      ? ' <a href="' + item.url + '" rel="noopener">Quelle: ' + item.source + '</a>'
      : "";
    return (
      '<article class="card news-item">' +
      "<h3>" + item.title + " " + badge + "</h3>" +
      '<p><time datetime="' + item.date + '">' + item.dateLabel + "</time> – " +
      item.text + link + "</p></article>"
    );
  }

  var news = window.GTA6_NEWS || [];

  /* News auf der Startseite: Filter-Tabs, erst 4 Meldungen, Rest per Button */
  var latest = document.getElementById("news-latest");
  if (latest && news.length) {
    var filters = {
      top: function (n) { return n.top; },
      all: function () { return true; },
      rumor: function (n) { return n.badge === "rumor"; },
    };
    function renderNews(key) {
      var items = news.filter(filters[key]);
      var first = items.slice(0, 4);
      var rest = items.slice(4, 14);
      latest.innerHTML = first.length
        ? first.map(newsCard).join("")
        : '<p class="lead">Aktuell keine Meldungen in dieser Kategorie.</p>';
      if (rest.length) {
        var hidden = document.createElement("div");
        hidden.innerHTML = rest.map(newsCard).join("");
        hidden.hidden = true;
        var btn = document.createElement("button");
        btn.className = "btn";
        btn.type = "button";
        btn.textContent = "Weitere News anzeigen (" + rest.length + ")";
        btn.addEventListener("click", function () {
          hidden.hidden = false;
          btn.remove();
          externalLinksNewTab();
        });
        latest.appendChild(btn);
        latest.appendChild(hidden);
      }
      externalLinksNewTab();
      document.querySelectorAll(".filter-tabs .tab").forEach(function (t) {
        t.classList.toggle("active", t.dataset.filter === key);
      });
    }
    document.querySelectorAll(".filter-tabs .tab").forEach(function (t) {
      t.addEventListener("click", function () { renderNews(t.dataset.filter); });
    });
    renderNews("top");
  }

  /* Timeline aufklappen */
  var tlBtn = document.getElementById("timeline-btn");
  var tlExtra = document.getElementById("timeline-extra");
  if (tlBtn && tlExtra) {
    tlBtn.addEventListener("click", function () {
      tlExtra.hidden = false;
      tlBtn.remove();
      externalLinksNewTab();
    });
  }

  /* Eigenwerbung: Teilen & Favorit */
  var shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var data = {
        title: "GTA6Guide",
        text: "GTA6Guide – Countdown, Release-Daten und News zu GTA VI",
        url: "https://gta6guide.de/",
      };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url).then(function () {
          shareBtn.textContent = "✓ Link kopiert!";
          setTimeout(function () { shareBtn.textContent = "↗ Seite teilen"; }, 2500);
        });
      }
    });
  }

  var favBtn = document.getElementById("fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", function () {
      var isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
      favBtn.textContent = isMac
        ? "Drücke ⌘ + D zum Speichern"
        : "Drücke Strg + D zum Speichern";
      setTimeout(function () { favBtn.textContent = "♥ Als Favorit speichern"; }, 4000);
    });
  }

  /* Externe Links in neuem Fenster öffnen (Nutzer bleibt auf der Seite) */
  function externalLinksNewTab() {
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      if (a.hostname !== location.hostname) {
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }
  externalLinksNewTab();

  /* Aktiven Nav-Link markieren */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
})();
