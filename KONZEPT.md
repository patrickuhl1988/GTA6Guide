# GTA6Guide – Website-Konzept

Stand: 18. August 2026 · Repo: `patrickuhl1988/GTA6Guide`

## 1. Idee & Positionierung

Da GTA VI erst am **19. November 2026** erscheint, ist die Seite bis zum Launch ein **Countdown- und Info-Hub** ("Alles, was bisher bekannt ist") und wird nach Release schrittweise zum echten Guide ausgebaut. Wichtig für Vertrauen und SEO: Wir trennen sauber zwischen **offiziell bestätigt** und **Gerücht/Erwartung** – das machen viele Konkurrenzseiten nicht.

**Rechtlicher Rahmen:** Fan-Seite, keine offiziellen Rockstar-Assets (Logos, Artwork, Screenshots aus Trailern) verwenden → Urheberrecht. Deshalb generieren wir alle Grafiken selbst im "Vice/Miami Neon"-Stil, ohne Markenzeichen. Disclaimer im Footer: "Inoffizielle Fan-Seite, nicht mit Rockstar Games oder Take-Two Interactive verbunden."

## 2. Technik

- **Hosting:** GitHub Pages direkt aus dem Repo (kostenlos, kein Server nötig)
- **Stack:** Statisches HTML/CSS/JS oder Astro (empfohlen: Astro, wenn wir News regelmäßig pflegen wollen; sonst reicht Vanilla)
- **Aktienkurs live:** Take-Two Interactive (NASDAQ: **TTWO**). Einfachste Lösung ohne API-Key und ohne Backend: **TradingView-Widget** einbetten (kostenlos, live). Alternative mit API-Key: Finnhub (Free Tier). → TradingView nehmen, dann entfällt "sonst weglassen".
- **Countdown:** reines JS, Ziel 19.11.2026
- **News:** anfangs manuell als Markdown/JSON gepflegt; später optional RSS-Aggregation

## 3. Seitenstruktur

### Startseite
- Hero mit Neon-Skyline, großem Countdown zum 19.11.2026
- Kacheln: Release-Daten · Editionen · Plattformen · News · Aktie
- Newsletter/Discord-CTA optional später

### Release & wichtige Daten (Timeline-Seite)
- Dez 2023: Trailer 1
- Mai 2025: Verschiebung aus 2025
- Trailer 2 (2025)
- Ursprünglicher Termin 26. Mai 2026 → verschoben
- 25. Juni 2026: Vorbestellungen gestartet
- **12. November 2026: Preload beginnt**
- **19. November 2026: Release (PS5, Xbox Series X|S)**
- Platzhalter für kommende Trailer/Events (Timeline wird laufend ergänzt)

### Plattformen
- **Zum Start:** PS5 (inkl. Pro) und Xbox Series X|S – mehr ist nicht angekündigt
- **PC:** nicht angekündigt; Erwartung basierend auf GTA V (18 Monate) und RDR2 (13 Monate): Ende 2027 bis Anfang 2028 – klar als Schätzung kennzeichnen
- **Switch 2 / Cloud Streaming:** nichts angekündigt; Abschnitt "Was wir wissen / was Spekulation ist"
- Warnhinweis: Fake-"PC-Downloads" sind Scams

### Editionen & Preise
- **Standard Edition:** 79,99 $ (EUR-Preis ergänzen)
- **Ultimate Edition:** 99,99 $ mit Bonus-Ingame-Inhalten
- Hinweis: Retail-Box enthält **Download-Code, keine Disc**
- Upgrade von Standard auf Ultimate nachträglich möglich
- Vergleichstabelle + Vorbesteller-Boni

### News
- Chronologische Liste, jede Meldung mit Quelle und Datum
- Tags: Offiziell / Gerücht / Analyse

### Was ist bisher bekannt? (Guide-Basis)
- Setting: Bundesstaat Leonida mit Vice City
- Protagonisten: Jason & Lucia
- Singleplayer offline spielbar, GTA Online-Komponente
- Map-Schätzungen (klar als Fan-Analyse markiert)
- Diese Seite wird nach Release zum eigentlichen Guide-Bereich (Missionen, Karte, Fahrzeuge, Waffen)

### Aktie (TTWO)
- TradingView-Widget mit Live-Kurs + Chart
- Kurzer Kontext: Warum der Kurs für GTA-Fans interessant ist (Delays bewegen die Aktie)
- Disclaimer: keine Anlageberatung

## 4. Design

- **Stil:** Miami/Vice-Neon – Sonnenuntergangs-Gradient (Pink → Orange → Violett), Palmen-Silhouetten, Grid-Retrowave-Elemente, dunkler Hintergrund
- **Farben:** #0d0221 (Hintergrund), #ff2e88 (Pink), #ff8c42 (Orange), #7b2ff7 (Violett), #2de2e6 (Cyan-Akzent)
- **Fonts:** Display: "Monoton" oder "Righteous" (Google Fonts), Text: "Inter"
- Alle Assets original per KI generiert (siehe PROMPT_ASSETS.md), keine Rockstar-IP

## 5. Roadmap

1. **Phase 1 (jetzt):** Repo-Setup, GitHub Pages, Startseite mit Countdown, Release-/Plattform-/Editionen-Seiten
2. **Phase 2 (Sep–Okt):** News-Bereich, Aktien-Widget, SEO (Meta, OG-Images, Sitemap), "Was ist bekannt"
3. **Phase 3 (Launch-Woche):** Preload-Guide, Unlock-Zeiten pro Region, Server-Status
4. **Phase 4 (nach Release):** Echter Guide: Missionen, Karte, Fahrzeuge, Cheats, GTA-Online-Section
