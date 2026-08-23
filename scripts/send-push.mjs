#!/usr/bin/env node
/**
 * GTA6Guide – automatische Push-Nachrichten bei neuen News.
 *
 * Sendet NUR, wenn eine Meldung:
 *   1. ausdrücklich mit  pushTopic: "news" | "events" | "release" | "deals"  markiert ist,
 *   2. noch nie gesendet wurde (Abgleich mit scripts/push-state.json),
 *   3. nicht älter als MAX_AGE_DAYS ist,
 *   4. und das Tageslimit / der Mindestabstand nicht überschritten ist.
 *
 * Beim allerersten Lauf wird nichts gesendet – alle vorhandenen Meldungen
 * werden nur als "gesehen" abgelegt (Baseline). So gibt es keine Nachschlag-Welle.
 *
 * Aufruf:
 *   node scripts/send-push.mjs            → echter Versand
 *   node scripts/send-push.mjs --dry-run  → zeigt nur an, was gesendet würde
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const NEWS_FILE = path.join(ROOT, "js", "news-data.js");
const STATE_FILE = path.join(ROOT, "scripts", "push-state.json");

const APP_ID = "fdc739a8-16ee-4aa7-a1c3-ddf7e8052e94";
const SITE_URL = "https://gta6guide.de/#news";

const MAX_AGE_DAYS = 3;     // ältere Meldungen lösen nie einen Push aus
const MAX_PER_RUN = 1;      // höchstens so viele Pushes pro Durchlauf
const MIN_GAP_MINUTES = 90; // Mindestabstand zwischen zwei Pushes
const VALID_TOPICS = ["news", "events", "release", "deals"];

const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.ONESIGNAL_API_KEY;

/* ---------- News einlesen ---------- */

function loadNews() {
  const code = readFileSync(NEWS_FILE, "utf8");
  const sandbox = { window: {} };
  createContext(sandbox);
  runInContext(code, sandbox, { timeout: 5000 });
  const news = sandbox.window.GTA6_NEWS;
  if (!Array.isArray(news)) throw new Error("GTA6_NEWS nicht gefunden oder kein Array");
  return news;
}

/* ---------- Stabile ID pro Meldung ---------- */

function newsId(item) {
  const slug = String(item.title || "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${item.date}_${slug}`;
}

/* ---------- Zustand ---------- */

function loadState() {
  if (!existsSync(STATE_FILE)) {
    return { initialized: false, sent: [], lastSentAt: null };
  }
  const raw = JSON.parse(readFileSync(STATE_FILE, "utf8"));
  return {
    initialized: raw.initialized === true,
    sent: Array.isArray(raw.sent) ? raw.sent : [],
    lastSentAt: raw.lastSentAt || null,
  };
}

function saveState(state) {
  // Liste beschränken, damit die Datei nicht endlos wächst
  const trimmed = { ...state, sent: state.sent.slice(-300) };
  writeFileSync(STATE_FILE, JSON.stringify(trimmed, null, 2) + "\n", "utf8");
}

/* ---------- Auswahl ---------- */

function isFresh(item) {
  const d = new Date(item.date + "T12:00:00Z");
  if (isNaN(d)) return false;
  const ageDays = (Date.now() - d.getTime()) / 86400000;
  return ageDays <= MAX_AGE_DAYS;
}

function pickCandidates(news, state) {
  const seen = new Set(state.sent);
  return news
    .filter((item) => VALID_TOPICS.includes(item.pushTopic))
    .filter((item) => !seen.has(newsId(item)))
    .filter(isFresh)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, MAX_PER_RUN);
}

function gapOk(state) {
  if (!state.lastSentAt) return true;
  const mins = (Date.now() - new Date(state.lastSentAt).getTime()) / 60000;
  return mins >= MIN_GAP_MINUTES;
}

/* ---------- Versand ---------- */

function shorten(text, max = 160) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return (lastStop > 80 ? cut.slice(0, lastStop + 1) : cut.trimEnd() + " …");
}

async function sendPush(item) {
  const payload = {
    app_id: APP_ID,
    headings: {
      en: item.title_en || item.title,
      de: item.title,
    },
    contents: {
      en: shorten(item.text_en || item.text),
      de: shorten(item.text),
    },
    url: SITE_URL,
    filters: [{ field: "tag", key: item.pushTopic, relation: "=", value: "1" }],
  };

  if (DRY_RUN) {
    console.log("— DRY RUN, es wird nichts gesendet —");
    console.log(JSON.stringify(payload, null, 2));
    return { id: "dry-run" };
  }

  const res = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Key ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`OneSignal HTTP ${res.status}: ${JSON.stringify(body)}`);
  }
  if (body.errors && !body.id) {
    throw new Error(`OneSignal-Fehler: ${JSON.stringify(body.errors)}`);
  }
  return body;
}

/* ---------- Ablauf ---------- */

async function main() {
  const news = loadNews();
  const state = loadState();

  // Erster Lauf: nur Baseline anlegen, nichts senden.
  if (!state.initialized) {
    const all = news.map(newsId);
    saveState({ initialized: true, sent: all, lastSentAt: null });
    console.log(`Baseline angelegt: ${all.length} vorhandene Meldungen als gesehen markiert.`);
    console.log("Es wurde bewusst nichts gesendet. Ab jetzt lösen nur neue Meldungen einen Push aus.");
    return;
  }

  const candidates = pickCandidates(news, state);

  if (!candidates.length) {
    console.log("Keine push-würdige neue Meldung gefunden – nichts zu tun.");
    return;
  }

  if (!gapOk(state)) {
    console.log(`Letzter Push liegt weniger als ${MIN_GAP_MINUTES} Minuten zurück – Versand verschoben.`);
    return;
  }

  if (!API_KEY && !DRY_RUN) {
    console.error("FEHLER: ONESIGNAL_API_KEY fehlt. Kein Versand.");
    process.exit(1);
  }

  for (const item of candidates) {
    const id = newsId(item);
    console.log(`Sende Push [${item.pushTopic}]: ${item.title}`);
    const result = await sendPush(item);
    console.log(`  → OneSignal-ID: ${result.id || "(keine)"}`);
    if (!DRY_RUN) {
      state.sent.push(id);
      state.lastSentAt = new Date().toISOString();
    }
  }

  if (!DRY_RUN) saveState(state);
}

main().catch((err) => {
  console.error("Push fehlgeschlagen:", err.message);
  process.exit(1);
});
