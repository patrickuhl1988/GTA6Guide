# GTA6Guide

Inoffizielle Fan-Seite zu Grand Theft Auto VI – Countdown, Release-Infos, Editionen, News und Take-Two-Aktienkurs.

- **Konzept:** siehe [KONZEPT.md](KONZEPT.md)
- **Asset-Generierung:** siehe [PROMPT_ASSETS.md](PROMPT_ASSETS.md)
- **Hosting:** GitHub Pages (Settings → Pages → Branch `main`, Ordner `/`)

Statisches HTML/CSS/JS, keine Build-Tools nötig.

## Automatische Push-Nachrichten

Neue News in `js/news-data.js` können automatisch einen Push an die Abonnenten auslösen.
Gesendet wird **nur**, wenn eine Meldung ausdrücklich markiert ist:

```js
{
  date: "2026-08-27",
  title: "…",
  pushTopic: "events",   // <-- löst den Push aus
  …
}
```

Erlaubte Werte für `pushTopic` (entsprechen den Themen, die Abonnenten anhaken können):

| Wert      | Thema in der Anmeldung        |
|-----------|-------------------------------|
| `news`    | Breaking News & Leaks         |
| `events`  | Trailer & Events              |
| `release` | Preload & Release-Erinnerung  |
| `deals`   | Preisaktionen                 |

Meldungen **ohne** `pushTopic` erscheinen ganz normal auf der Seite, lösen aber keinen Push aus.
Das ist der Normalfall – die Markierung ist bewusst die Ausnahme für wirklich relevante Meldungen.

### Schutzmechanismen

* **Nie doppelt:** Jede gesendete Meldung wird in `scripts/push-state.json` vermerkt. Auch
  wenn die Datei später erneut bearbeitet wird, geht kein zweiter Push raus.
* **Keine Altlasten:** Meldungen, die älter als 3 Tage sind, lösen nie einen Push aus.
* **Höchstens ein Push pro Durchlauf** und mindestens 90 Minuten Abstand zum vorherigen.
* **Erster Lauf sendet nichts:** Beim ersten Durchlauf werden alle bestehenden Meldungen
  nur als „gesehen" abgelegt, damit es keine Nachschlag-Welle gibt.

### Einrichtung (einmalig)

1. In OneSignal unter *Settings → Keys & IDs* den **REST API Key** kopieren.
2. Im GitHub-Repo unter *Settings → Secrets and variables → Actions → New repository secret*
   anlegen: Name `ONESIGNAL_API_KEY`, Wert = der kopierte Key.

Ohne dieses Secret läuft der Workflow, bricht aber vor dem Versand ab – es geht nichts raus.

### Testen

Unter *Actions → „Push-Nachricht bei neuen News" → Run workflow* lässt sich der Ablauf mit
aktiviertem **dry run** starten: Das Log zeigt dann genau, was gesendet würde, ohne dass
tatsächlich etwas rausgeht.
