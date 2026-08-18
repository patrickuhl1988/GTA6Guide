/* GTA6Guide – Countdown & Navigation */

(function () {
  "use strict";

  var LANG = document.documentElement.lang || "de";
  var I18N = {
    de: { live: "GTA VI ist da! 🎉", more: "Weitere News anzeigen", official: "Offiziell", rumor: "Gerücht",
          empty: "Aktuell keine Meldungen in dieser Kategorie.", src: "Quelle",
          favMac: "Drücke ⌘ + D zum Speichern", favWin: "Drücke Strg + D zum Speichern",
          fav: "Als Favorit speichern", copied: "✓ Link kopiert!", share: "Seite teilen" , pushOk: "✓ Aktiviert – wir melden uns!", pushErr: "Bitte Benachrichtigungen im Browser erlauben.", nlOk: "✓ Eingetragen!", nlErr: "Das hat nicht geklappt – bitte später erneut versuchen." },
    en: { live: "GTA VI is out! 🎉", more: "Show more news", official: "Official", rumor: "Rumor",
          empty: "No items in this category right now.", src: "Source",
          favMac: "Press ⌘ + D to bookmark", favWin: "Press Ctrl + D to bookmark",
          fav: "Bookmark this site", copied: "✓ Link copied!", share: "Share this page" , pushOk: "✓ Enabled – we\u2019ll be in touch!", pushErr: "Please allow notifications in your browser.", nlOk: "✓ Subscribed!", nlErr: "That didn\u2019t work – please try again later." },
    zh: { live: "GTA VI 已发售！🎉", more: "显示更多新闻", official: "官方", rumor: "传闻",
          empty: "该分类暂无内容。", src: "来源",
          favMac: "按 ⌘ + D 收藏", favWin: "按 Ctrl + D 收藏",
          fav: "收藏本站", copied: "✓ 链接已复制！", share: "分享本页" , pushOk: "✓ 已开启——有消息第一时间通知！", pushErr: "请在浏览器中允许通知。", nlOk: "✓ 订阅成功！", nlErr: "出了点问题，请稍后再试。" },
    hi: { live: "GTA VI आ गया! 🎉", more: "और न्यूज़ देखें", official: "आधिकारिक", rumor: "अफ़वाह",
          empty: "फ़िलहाल इस श्रेणी में कुछ नहीं।", src: "स्रोत",
          favMac: "बुकमार्क के लिए ⌘ + D दबाएँ", favWin: "बुकमार्क के लिए Ctrl + D दबाएँ",
          fav: "बुकमार्क करें", copied: "✓ लिंक कॉपी हुआ!", share: "पेज शेयर करें" , pushOk: "✓ चालू — ख़बर मिलते ही बताएँगे!", pushErr: "कृपया ब्राउज़र में नोटिफ़िकेशन की अनुमति दें।", nlOk: "✓ सब्सक्राइब हो गया!", nlErr: "कुछ गड़बड़ हुई — बाद में फिर कोशिश करें।" },
  };
  var T = I18N[LANG] || I18N.de;

  /* Sprache rein per Geo-IP: einmal pro Sitzung, auf jeder Seite */
  var LANG_FILES = ["", "index.html", "guide.html", "editionen.html", "bekannt.html", "plattformen.html"];
  var LIMITED = { zh: true, hi: true }; // diese Sprachen haben keine plattformen.html
  function pageFile() {
    var f = location.pathname.split("/").pop();
    return f === "" ? "index.html" : f;
  }
  function goLang(target) {
    if (target === LANG) return;
    if (location.protocol === "file:") return;
    var f = pageFile();
    if (LANG_FILES.indexOf(f) === -1) return;
    if (LIMITED[target] && f === "plattformen.html") f = "index.html";
    var path = (target === "de" ? "/" : "/" + target + "/") + (f === "index.html" ? "" : f);
    location.replace(path);
  }
  try {
    var isBot = /bot|crawl|spider|slurp|bingpreview/i.test(navigator.userAgent);
    if (!isBot && !sessionStorage.getItem("gta6guide-geo")) {
      sessionStorage.setItem("gta6guide-geo", "1");
      fetch("https://get.geojs.io/v1/ip/country.json")
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var c = (d && d.country) || "";
          var map = { DE: "de", AT: "de", CH: "de", LI: "de", LU: "de",
                      CN: "zh", HK: "zh", MO: "zh", TW: "zh", SG: "zh",
                      IN: "hi" };
          goLang(map[c] || "en");
        })
        .catch(function () {});
    }
  } catch (e) {}

  /* ---------- OneSignal: Push-Abos mit Themen-Tags + Newsletter ---------- */
  function collectTags(el) {
    var tags = {};
    var explicit = el.getAttribute("data-tags");
    if (explicit) {
      explicit.split(",").forEach(function (t) { if (t.trim()) tags[t.trim()] = "1"; });
    }
    var scope = el.closest(".notify-card, .card, .notify");
    if (scope) {
      scope.querySelectorAll("input[data-tag]:checked").forEach(function (cb) {
        tags[cb.getAttribute("data-tag")] = "1";
      });
    }
    if (Object.keys(tags).length === 0) tags.news = "1";
    return tags;
  }

  document.querySelectorAll("[data-push]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tags = collectTags(btn);
      if (!window.OneSignalDeferred) return;
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          await OneSignal.Notifications.requestPermission();
          if (OneSignal.Notifications.permission) {
            OneSignal.User.addTags(tags);
            btn.textContent = T.pushOk;
            btn.disabled = true;
          } else {
            btn.textContent = T.pushErr;
            setTimeout(function () { location.reload(); }, 3500);
          }
        } catch (e) {
          btn.textContent = T.pushErr;
        }
      });
    });
  });

  document.querySelectorAll(".nl-form").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = form.querySelector("input[type=email]");
      var submit = form.querySelector("button");
      var email = input && input.value.trim();
      if (!email || !window.OneSignalDeferred) return;
      var tags = collectTags(form);
      tags.newsletter = "1";
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          OneSignal.User.addEmail(email);
          OneSignal.User.addTags(tags);
          submit.textContent = T.nlOk;
          submit.disabled = true;
          input.disabled = true;
        } catch (e) {
          submit.textContent = T.nlErr;
        }
      });
    });
  });

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
        '<p class="cd-live">' + T.live + '</p>';
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
    var isOfficial = item.badge === "official";
    var useDe = LANG === "de";
    var title = useDe ? item.title : (item.title_en || item.title);
    var text = useDe ? item.text : (item.text_en || item.text);
    var dateLabel = useDe ? item.dateLabel : (item.dateLabel_en || item.dateLabel);
    var badge = isOfficial
      ? '<span class="badge badge-official">' + T.official + "</span>"
      : '<span class="badge badge-rumor">' + T.rumor + "</span>";
    var link = item.url
      ? ' <a class="src" href="' + item.url + '" rel="noopener">' + T.src + ": " + item.source + "</a>"
      : "";
    return (
      '<article class="card news-item ' + (isOfficial ? "is-official" : "is-rumor") + '">' +
      '<div class="news-meta"><time datetime="' + item.date + '">' + dateLabel + "</time>" + badge + "</div>" +
      "<h3>" + title + "</h3>" +
      "<p>" + text + link + "</p></article>"
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
        : '<p class="lead">' + T.empty + '</p>';
      if (rest.length) {
        var hidden = document.createElement("div");
        hidden.innerHTML = rest.map(newsCard).join("");
        hidden.hidden = true;
        var btn = document.createElement("button");
        btn.className = "btn";
        btn.type = "button";
        btn.textContent = T.more + " (" + rest.length + ")";
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
