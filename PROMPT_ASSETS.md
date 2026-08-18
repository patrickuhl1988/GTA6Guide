# ChatGPT-Prompt: Assets für GTA6Guide generieren

**Wichtig vorab:** ChatGPT kann nicht selbst in ein GitHub-Repo committen. Der Prompt lässt ChatGPT alle Dateien erzeugen und als Download bereitstellen – danach committest du sie selbst:

```bash
git add assets/ && git commit -m "Add generated brand assets" && git push
```

(Gib ChatGPT niemals einen GitHub-Token – Tokens gehören nicht in Chats.)

---

## Der Prompt (komplett kopieren)

Du bist Art Director für eine inoffizielle GTA-6-Fan-Website namens "GTA6Guide". Erstelle einen kompletten, konsistenten Asset-Satz im Retrowave-/Miami-Neon-Stil. WICHTIG: Verwende KEINE geschützten Rockstar-Inhalte – kein GTA-Logo, keine Schriftzüge im GTA-Stil, keine Charaktere oder Szenen aus Trailern. Alles muss originales, generisches Miami/Vice-Neon-Design sein.

**Design-System:**
- Hintergrund: #0d0221 (fast schwarz, violettstichig)
- Primär: Neon-Pink #ff2e88, Orange #ff8c42, Violett #7b2ff7, Akzent Cyan #2de2e6
- Motive: Sonnenuntergangs-Gradient, Palmen-Silhouetten, Retrowave-Grid, Neon-Glow
- Stil: clean, modern, leicht retro – keine Fotorealistik

**Erstelle folgende Dateien** (SVGs als Code-Dateien zum Download, Rasterbilder per Bildgenerierung):

1. `assets/logo.svg` – Wortmarke "GTA6GUIDE" in Neon-Optik mit Glow, horizontale Variante, transparenter Hintergrund, funktioniert auf dunklem Grund
2. `assets/logo-icon.svg` – quadratisches Icon (Palme vor Sonnenkreis im Grid), für Favicon-Basis
3. `assets/favicon.svg` – vereinfachte Version von logo-icon, erkennbar bei 32×32
4. `assets/hero-bg.png` – 1920×1080, Neon-Skyline mit Palmen, Sonnenuntergang, Retrowave-Grid im Vordergrund, unten dunkler auslaufend (damit Text darüber lesbar ist), keine Schrift im Bild
5. `assets/og-image.png` – 1200×630 Social-Media-Vorschaubild, gleicher Stil, mit Schriftzug "GTA6GUIDE" und "Countdown zum 19.11.2026"
6. Icon-Set als einzelne SVGs, einfarbig Cyan #2de2e6, Strichstärke einheitlich, 24×24 Viewbox, transparenter Hintergrund:
   - `assets/icons/calendar.svg` (Release-Daten)
   - `assets/icons/console.svg` (Plattformen)
   - `assets/icons/editions.svg` (Editionen, z. B. gestapelte Boxen)
   - `assets/icons/news.svg` (Zeitung)
   - `assets/icons/chart.svg` (Aktienkurs)
   - `assets/icons/info.svg` (Was ist bekannt)
   - `assets/icons/countdown.svg` (Sanduhr/Timer)
7. `assets/section-divider.svg` – dekorativer horizontaler Trenner (Neon-Linie mit Glow-Gradient), skalierbar
8. `assets/palm-silhouette.svg` – einzelne Palmen-Silhouette als Deko-Element, einfarbig, transparent

**Ablauf:**
- Erzeuge zuerst alle SVGs als vollständigen, validen SVG-Code (inline optimiert, keine externen Fonts – Text in Pfade umwandeln oder als <text> mit websicherer Fallback-Angabe)
- Generiere dann die PNG-Bilder
- Packe am Ende alles in eine ZIP mit der Ordnerstruktur `assets/…` und stelle sie als Download bereit
- Liste abschließend alle Dateien mit einem Satz Verwendungszweck auf

Frage nicht nach – triff sinnvolle Design-Entscheidungen und liefere direkt.

---

## Nach dem Download

1. ZIP entpacken, `assets/`-Ordner ins Repo-Root legen
2. Prüfen: SVGs im Browser öffnen (valide?), Favicon bei kleiner Größe testen
3. Committen & pushen (Befehl oben)
