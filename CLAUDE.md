# Tompa Marine Bridge

## Projektöversikt

Kompletterande digitalt bryggsystem för kommersiella fartyg. Installeras på Raspberry Pi 5 bredvid befintlig certifierad bryggutrustning (Furuno, Kongsberg etc). Produkten är ett **komplement** — inte ersättning — och kräver därför ingen typgodkännande.

Målgrupp: Kust- och inlandssjöfart, rederier med äldre flottor, offshore/specialfartyg. Säljs in mot rederier som vill ha realtidsövervakning från land, digital loggbok, bränsleoptimering och moderna checklistor — utan att investera 150-500 tkr per fartyg.

Systemet är byggt av en kapten, för kaptener.

---

## Två deploy-targets — samma app

| | **Vercel (demo)** | **Raspberry Pi (produktion)** |
|---|---|---|
| URL | `tompa.vercel.app` | `http://localhost:3000` |
| Syfte | Demo, pitch, säljverktyg | Ombord på fartyg |
| Data | Simulerad realistisk mockdata | Riktiga sensorer via SignalK |
| Backend | Vercel Edge / statisk | Express + WebSocket lokal |
| Databas | localStorage | SQLite |
| Internet | Krävs | Valfritt (4G/5G) |
| Målgrupp | Rederier som utvärderar | Besättning ombord |

Arkitekturen ska stödja båda från samma kodbas. React-appen detekterar environment och väljer datakälla:
- **Vercel/demo:** `useSimulatedData()` — inbyggd realistisk simulering med jitter
- **Pi/produktion:** `useSignalKData()` — WebSocket mot lokal SignalK-server

Git-repo pushes till GitHub → Vercel bygger och deployar automatiskt.

---

## Tech Stack

### Frontend
- **React 18+** med TypeScript
- **Vite** som bundler/dev-server
- Komponentbibliotek: egna komponenter, marin design
- Kartor: **Leaflet** + **OpenSeaMap**-tiles (offline-kapabla på Pi)
- Styling: **Tailwind CSS**
- Touch-optimerat för 7" pekskärm (1024×600) men responsivt för desktop/mobil

### Backend
- **Node.js** + **Express** (Pi)
- **WebSocket** (ws) för realtidsdata till frontend (Pi)
- **SQLite** (via better-sqlite3) för loggbok, tripdata, checklistor (Pi)
- REST API för extern integration och rederi-dashboard

### Python (databehandling & sensorer — bara Pi)
- **SMHI API-klient** — hämtar väderprognos, tidvatten, oceanografi
- **Trafikverket API** — broöppningstider
- **Sjöfartsverket** — NAVTEX/sjöfartsmeddelanden
- **GPIO-hantering** — bilgesensorer, fysisk MOB-knapp (gpiozero)
- **Data-analys** — bränsleoptimering, trip-statistik

### Infrastruktur
- **GitHub** repo → **Vercel** auto-deploy vid push till main
- **Raspberry Pi 5** (4GB+) med Raspberry Pi OS (produktion)
- **Chromium kiosk-läge** (Pi)
- **systemd** services för autostart (Pi)
- **VS Code** som editor

---

## Vercel-specifikt

### Deploy-setup
Repot kopplas till Vercel. Vid varje push till `main` deployas automatiskt till `tompa.vercel.app`.

```
GitHub repo: tompa-marine-bridge
  ↓ git push
Vercel: tompa.vercel.app
  ↓ auto build
Vite → static React app med simulerad data
```

### Demo-läge (Vercel)
- All data simuleras i frontend med realistiska värden och jitter
- Simuleringen ska se ut som en riktig resa längs svenska västkusten
- AIS-fartyg rör sig, vind skiftar, djup varierar
- MOB-knappen fungerar (sparar simulerad position)
- Checklistor fungerar (sparas i localStorage)
- Väderprognos: hårdkodad realistisk mock
- Besökaren ska tro att det är riktiga data första sekunderna

---

## Marin datakällor — så kopplas allt (bara Pi)

| Data | Källa | Anslutning | Protokoll |
|------|-------|------------|-----------|
| Fart, kurs, djup, vind, vattentemp | Båtens instrument | NMEA 0183 → USB RS422 | SignalK |
| Position (GPS) | Båtens GPS eller USB-modul | USB → gpsd → SignalK | NMEA |
| AIS (fartyg) | AIS-mottagare | NMEA → SignalK | !AIVDM |
| Motor, tankar, batteri | NMEA 2000 sensorer | Actisense NGT-1 USB | SignalK PGN |
| Autopilot | Raymarine/B&G via NMEA 2000 | Samma gateway | PGN 65379 |
| Bilge | Floatsensor → GPIO | RPi GPIO pin | Python gpiozero |
| Väder | SMHI Open API | HTTPS (4G) | JSON REST |
| Tidvatten/ström | SMHI oceanografi | HTTPS (4G) | JSON REST |
| Broöppningar | Trafikverket API | HTTPS (4G) | JSON REST |
| NAVTEX | Sjöfartsverket MSI | HTTPS eller seriell | Text/JSON |
| Sjökort | OpenSeaMap tiles | Offline + online | Leaflet tiles |

---

## Funktioner — 7 flikar

### 1. BRYGGA
- Kompass (SVG, animerad rotation)
- SOG, COG, STW med enheter
- GPS-position med GNSS-status (satelliter, HDOP, fix-typ)
- Vindindikator (riktning, hastighet, byvind)
- Djup med larm vid grunt vatten
- Luft/vattentemperatur
- Barometer med 6h sparkline-trend (stigande/fallande/stabil)
- Autopilot-status (standby/auto/vind/track, inställd kurs, roderutslag)
- Ankarlarm (aktivera/deaktivera, radie, drift i meter, larm)
- Nästa hamn med ETA och status

### 2. KARTA
- Leaflet-karta med OpenSeaMap-sjökort
- Egen position med kursvektor
- AIS-fartyg (trianglar med COG, namnlabel, fartvektor)
- AIS-lista sorterad på avstånd + CPA/TCPA-beräkning
- Ruttplan med waypoints (passerad/aktiv/planerad)
- Ankarzon (streckad cirkel)
- MOB-markör med pulserande ring
- Klickbar — tryck på fartyg/waypoint för detaljer

### 3. HAMNAR
- Hamnlista med ETA, status (öppen/begränsad/stängd)
- Broöppningstider med nedräkning
- Tidvatten och ström
- VHF-kanaler per hamn/område

### 4. MASKIN
- Varvtal (RPM) med larm
- Tankar: bränsle, färskvatten, svartvatten (procentbarer)
- Batteri: spänning, laddström per bank
- Motortemperaturer: kylvatten, avgaser, olja
- Bilge: vattennivå, pumpstatus, pumpräknare, larm
- Förbrukning: momentan (l/h), kvar (L), räckvidd (nm)
- Drifttimmar: motor, sedan service, till nästa service

### 5. VÄDER
- 12-timmars prognos (timvis: ikon, temp, vind med riktning)
- Sjöväder: våghöjd, vågperiod, sikt
- 5-dagarsprognos
- Varningar (kuling, storm, dimma)

### 6. SÄKERHET
- NAVTEX/sjöfartsmeddelanden
- Checklista — Avgång (12 punkter, avbockningsbar, progress-bar)
- Checklista — Ankomst (8 punkter)
- Checklista — Nödsituation (10 punkter)
- Sparas i SQLite (Pi) eller localStorage (Vercel)

### 7. LOGG
- Digital skeppsdagbok
- Manuella loggposter
- Trip-dator — dagens resa: distans, snittfart, maxfart, tid, bränsle
- Trip-dator — total resa (multi-dag)
- Besättning och vaktschema

### Globala funktioner
- **MOB-knapp** — fast röd knapp, sparar position, timer, bäring tillbaka
- **Nattläge** — röd dimning för nattseende
- **Ljusstyrka** — slider 10-100%
- **Larmsystem** — critical/warning, blinkande banner, ljud

---

## Design

- **Mörkt tema** — marin ECDIS-känsla
- Bakgrund: `#040e14`, paneler: `#0a1e28`, accent: `#e8891c` (Tompa-orange)
- Typsnitt: JetBrains Mono (data), Outfit (rubriker)
- Touch-targets: minst 44×44px
- Animerade kompass, vindindikator, gauges
- Responsive: 1024×600 (Pi), desktop, mobil

---

## Projektstruktur

```
tompa-marine-bridge/
├── CLAUDE.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── .gitignore
├── README.md
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── layout/            ← Header, TabBar, AlarmBar, MobButton, NightMode
│   │   ├── bridge/            ← Compass, WindIndicator, DepthGauge, Barometer, Autopilot, Anchor
│   │   ├── chart/             ← SeaChart, AISList, WaypointList
│   │   ├── harbors/           ← HarborList, BridgeOpenings, TideInfo, VHFChannels
│   │   ├── engine/            ← RPMGauge, TankBars, BatteryInfo, BilgeStatus, FuelRange
│   │   ├── weather/           ← HourlyForecast, SeaWeather, DailyForecast, Warnings
│   │   ├── safety/            ← NavtexMessages, Checklist
│   │   └── log/               ← LogBook, TripComputer, CrewList
│   ├── hooks/
│   │   ├── useBoatData.ts     ← Väljer datakälla baserat på environment
│   │   ├── useSimulatedData.ts ← Vercel — realistisk simulering
│   │   ├── useSignalKData.ts  ← Pi — riktig data via WebSocket
│   │   └── useAlarms.ts
│   ├── types/
│   │   └── marine.ts
│   ├── utils/
│   │   ├── navigation.ts      ← Haversine, CPA/TCPA, bäring
│   │   ├── units.ts
│   │   └── format.ts
│   ├── data/
│   │   ├── simulation.ts      ← Mockdata västkustrutt
│   │   ├── aisVessels.ts
│   │   ├── harbors.ts
│   │   ├── weather.ts
│   │   └── checklists.ts
│   └── styles/
│       └── theme.css
│
├── server/                    ← Bara Pi
│   ├── index.ts
│   ├── signalk.ts
│   ├── database.ts
│   └── api/
│
├── python/                    ← Bara Pi
│   ├── requirements.txt
│   ├── smhi_weather.py
│   ├── trafikverket.py
│   ├── navtex.py
│   └── gpio_sensors.py
│
├── deploy/                    ← Pi deploy
│   ├── install.sh
│   ├── tompa-marine.service
│   ├── kiosk.sh
│   └── config.env
│
└── docs/
    └── api.md
```

---

## Konventioner

- **Språk i UI:** Svenska
- **Språk i kod:** Engelska
- **Marin terminologi:** SOG, COG, STW, CPA, TCPA, TWD, TWS, AWA
- **Enheter:** SI internt, konvertera vid rendering (m/s→kn, K→°C, rad→°)
- **Git:** Conventional Commits (feat:, fix:, docs:)
- **Namngivning:** PascalCase komponenter, camelCase funktioner
- **Max ~150 rader per komponent**
- **State:** React Context + useReducer
- **Offline-first** på Pi, online-first på Vercel
- **Vercel-first vid utveckling** — bygg så det funkar i browser, Pi-specifikt senare

---

## Kommandon

```bash
npm run dev          # Lokal dev med simulerad data
git push origin main # Auto-deploy till tompa.vercel.app
npm run build        # Produktionsbuild
npm run dev:pi       # Pi-läge med Express + SignalK
```

---

## Prioriteringsordning

1. Projektstruktur + Vite dev-server
2. Simulerad data (useSimulatedData) — västkustrutt
3. Brygga-flik (kompass, fart, position, vind, djup)
4. Vercel deploy — pushbar till tompa.vercel.app
5. Karta-flik (Leaflet + OpenSeaMap + position)
6. AIS på kartan
7. Maskin-flik
8. Hamnar-flik
9. Väder-flik
10. Säkerhet-flik (checklistor, NAVTEX)
11. Logg-flik
12. MOB, nattläge, larm
13. Polish och responsivitet
14. Raspberry Pi deploy + kiosk
15. Rederi-dashboard (framtida)
