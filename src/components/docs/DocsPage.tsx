interface DocsPageProps {
  onBack: () => void
}

export function DocsPage({ onBack }: DocsPageProps) {
  return (
    <div className="min-h-screen bg-marine-bg text-marine-text">
      {/* Header */}
      <header className="bg-marine-panel border-b border-marine-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-marine-text-dim hover:text-marine-text text-sm font-mono"
          >
            ← Tillbaka till bryggan
          </button>
        </div>
        <div className="text-marine-accent font-bold font-sans">TOMPA Docs</div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-marine-accent to-amber-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-marine-text-bright mb-2">
            Tompa Marine Bridge
          </h1>
          <p className="text-marine-text-dim font-mono text-sm max-w-lg mx-auto">
            Kompletterande digitalt bryggsystem för kommersiella fartyg.
            Byggt av en kapten, för kaptener.
          </p>
        </section>

        {/* System Overview */}
        <DocSection title="Systemöversikt" id="overview">
          <p>Tompa Marine Bridge är ett kompletterande digitalt bryggsystem som installeras på Raspberry Pi 5
             bredvid befintlig certifierad bryggutrustning. Systemet kräver ingen typgodkännande då det är
             ett komplement, inte en ersättning.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InfoCard
              title="Demo (Vercel)"
              items={['URL: tompa-mb.vercel.app', 'Simulerad realistisk data', 'Ingen installation', 'För demo och pitch']}
            />
            <InfoCard
              title="Produktion (Raspberry Pi)"
              items={['Localhost:3000', 'Riktiga sensorer via SignalK', 'SQLite databas', 'Kiosk-läge på 7" pekskärm']}
            />
          </div>
        </DocSection>

        {/* Architecture Flowchart */}
        <DocSection title="Arkitektur" id="architecture">
          <FlowChart />
        </DocSection>

        {/* Data Sources */}
        <DocSection title="Datakällor & API:er" id="apis">
          <p>Systemet samlar data från flera källor, både fysiska sensorer och webbtjänster:</p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-marine-text-dim border-b border-marine-border">
                  <th className="text-left py-2 px-3">Data</th>
                  <th className="text-left py-2 px-3">Källa</th>
                  <th className="text-left py-2 px-3">Protokoll</th>
                  <th className="text-left py-2 px-3">Miljö</th>
                </tr>
              </thead>
              <tbody className="text-marine-text">
                <ApiRow data="Fart, kurs, djup, vind" source="Båtens instrument" protocol="NMEA 0183 → SignalK" env="Pi" />
                <ApiRow data="GPS Position" source="GPS/USB-modul" protocol="NMEA → gpsd → SignalK" env="Pi" />
                <ApiRow data="AIS-fartyg" source="AIS-mottagare" protocol="!AIVDM → SignalK" env="Pi" />
                <ApiRow data="Motor, tankar" source="NMEA 2000" protocol="Actisense → SignalK PGN" env="Pi" />
                <ApiRow data="Bilge" source="Floatsensor" protocol="GPIO (gpiozero)" env="Pi" />
                <ApiRow data="Väder" source="SMHI Open API" protocol="HTTPS REST/JSON" env="Båda" />
                <ApiRow data="Tidvatten" source="SMHI oceanografi" protocol="HTTPS REST/JSON" env="Båda" />
                <ApiRow data="Broöppningar" source="Trafikverket API" protocol="HTTPS REST/JSON" env="Båda" />
                <ApiRow data="NAVTEX" source="Sjöfartsverket MSI" protocol="HTTPS / Seriell" env="Pi" />
                <ApiRow data="Sjökort" source="OpenSeaMap tiles" protocol="Leaflet (offline+online)" env="Båda" />
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* SignalK Integration */}
        <DocSection title="SignalK-integration" id="signalk">
          <p>SignalK är en öppen standard för marindata. På Raspberry Pi kör vi SignalK-server som
             samlar alla NMEA-datakällor till ett WebSocket-API:</p>
          <CodeBlock title="SignalK WebSocket" code={`// Anslut till lokal SignalK-server
const ws = new WebSocket('ws://localhost:3000/signalk/v1/stream')

ws.onmessage = (event) => {
  const delta = JSON.parse(event.data)
  // delta.updates[].values[] innehåller:
  // - navigation.speedOverGround (m/s)
  // - navigation.courseOverGroundTrue (rad)
  // - navigation.position { latitude, longitude }
  // - environment.depth.belowTransducer (m)
  // - environment.wind.speedApparent (m/s)
  // - environment.wind.angleApparent (rad)
}`} />
          <CodeBlock title="Enhetshanteing" code={`// SignalK använder SI-enheter internt:
// Fart: m/s → konvertera till knop (* 1.94384)
// Vinkel: radianer → grader (* 180/π)
// Temp: Kelvin → Celsius (- 273.15)

function msToKnots(ms: number): number {
  return ms * 1.94384
}
function radToDeg(rad: number): number {
  return rad * (180 / Math.PI)
}`} />
        </DocSection>

        {/* Raspberry Pi Setup */}
        <DocSection title="Raspberry Pi Setup" id="pi-setup">
          <p>Produktionssystemet kör på Raspberry Pi 5 (4GB+) med 7" officiell pekskärm (1024×600).</p>
          <CodeBlock title="Installation" code={`# 1. Installera Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# 2. Installera SignalK server
sudo npm install -g signalk-server
signalk-server-setup  # Konfigurera NMEA-portar

# 3. Klona och installera Tompa
git clone https://github.com/niclaslof/tompa-marine-bridge.git
cd tompa-marine-bridge
npm install
npm run build

# 4. Konfigurera systemd-service
sudo cp deploy/tompa-marine.service /etc/systemd/system/
sudo systemctl enable tompa-marine
sudo systemctl start tompa-marine

# 5. Konfigurera kiosk-läge
sudo cp deploy/kiosk.sh /usr/local/bin/
chmod +x /usr/local/bin/kiosk.sh
# Lägg till i .bashrc eller autostart`} />
          <CodeBlock title="deploy/tompa-marine.service" code={`[Unit]
Description=Tompa Marine Bridge
After=network.target signalk.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/tompa-marine-bridge
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target`} />
          <CodeBlock title="deploy/kiosk.sh" code={`#!/bin/bash
# Kiosk-läge för 7" pekskärm
xset s off          # Stäng av skärmsläckare
xset -dpms           # Stäng av energisparläge
xset s noblank

chromium-browser \\
  --kiosk \\
  --noerrdialogs \\
  --disable-translate \\
  --no-first-run \\
  --fast \\
  --fast-start \\
  --disable-infobars \\
  --disable-features=TranslateUI \\
  --overscroll-history-navigation=0 \\
  http://localhost:3000`} />
        </DocSection>

        {/* Hardware */}
        <DocSection title="Hårdvara" id="hardware">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              title="Grundpaket"
              items={[
                'Raspberry Pi 5 (4GB) — ~800 kr',
                'Officiell 7" pekskärm — ~900 kr',
                'USB-RS422 adapter (NMEA) — ~200 kr',
                'Micro SD 32GB — ~100 kr',
                'Hölje/ram — ~300 kr',
                'Totalt: ~2 300 kr',
              ]}
            />
            <InfoCard
              title="Tillval"
              items={[
                'Actisense NGT-1 (NMEA 2000) — ~2 500 kr',
                'USB GPS-mottagare — ~400 kr',
                'AIS-mottagare — ~2 000 kr',
                '4G/5G modem — ~1 500 kr',
                'Extra GPIO-sensorer — ~200 kr',
              ]}
            />
          </div>
          <HardwareDiagram />
        </DocSection>

        {/* Tech Stack */}
        <DocSection title="Tech Stack" id="tech">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'React 18+', desc: 'UI framework' },
              { name: 'TypeScript', desc: 'Typsäkerhet' },
              { name: 'Vite', desc: 'Bundler/dev' },
              { name: 'Tailwind CSS', desc: 'Styling' },
              { name: 'Node.js', desc: 'Backend (Pi)' },
              { name: 'SQLite', desc: 'Databas (Pi)' },
              { name: 'SignalK', desc: 'Marindata' },
              { name: 'Leaflet', desc: 'Kartor' },
              { name: 'Python', desc: 'Sensorer/API' },
              { name: 'WebSocket', desc: 'Realtid' },
              { name: 'Vercel', desc: 'Demo-deploy' },
              { name: 'GitHub', desc: 'CI/CD' },
            ].map(t => (
              <div key={t.name} className="bg-marine-panel-light rounded-lg p-3 border border-marine-border text-center">
                <div className="text-sm font-mono font-bold text-marine-text-bright">{t.name}</div>
                <div className="text-[10px] font-mono text-marine-text-dim">{t.desc}</div>
              </div>
            ))}
          </div>
        </DocSection>

        {/* Tidtabell feature */}
        <DocSection title="Tidtabell-funktionen" id="timetable">
          <p>Kärnan i systemet för pendelbåtstrafik. Hämtad från operativ erfarenhet av Stockholms pendelbåtar (Linje 80 & 89).</p>
          <div className="mt-4 space-y-3">
            <FeatureItem title="Stor nedräkning" desc="Minuter och sekunder till nästa avgång, centralt placerad. Blinkar rött vid försening." />
            <FeatureItem title="Bryggvisning" desc="Aktuell brygga och avgångstid, plus nästa brygga ('There after')." />
            <FeatureItem title="GPS-klocka" desc="Extremt noggrann tid från GPS-signal med sekunder. Kritiskt för tidtabellshållning." />
            <FeatureItem title="Mötesvarning" desc="Visar när och var du möter andra fartyg. Extra varning vid trånga passager som Nacka Strand." />
            <FeatureItem title="Föreslagen fart" desc="Beräknar optimal fart för att hålla tidtabellen. Kan minska bränsleförbrukningen." />
            <FeatureItem title="Linje- och omloppsval" desc="Välj Linje 80 eller 89, sedan aktuellt omlopp. Systemet följer tidtabellen automatiskt." />
          </div>
        </DocSection>

        {/* Footer */}
        <footer className="border-t border-marine-border pt-8 pb-12 text-center">
          <div className="text-marine-text-dim text-xs font-mono">
            Tompa Marine Bridge — Byggt av Niclas Löfvenmark
          </div>
          <div className="text-marine-text-dim text-xs font-mono mt-1">
            <a href="https://github.com/niclaslof/tompa-marine-bridge" className="text-marine-accent hover:underline">
              github.com/niclaslof/tompa-marine-bridge
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

function DocSection({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="text-xl font-sans font-bold text-marine-text-bright mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-marine-accent rounded-full" />
        {title}
      </h2>
      <div className="text-sm font-mono text-marine-text leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
      <h3 className="text-sm font-sans font-semibold text-marine-accent mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs font-mono text-marine-text flex items-start gap-2">
            <span className="text-marine-accent mt-0.5">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="mt-3">
      <div className="text-[10px] font-mono text-marine-text-dim uppercase tracking-wider mb-1">{title}</div>
      <pre className="bg-marine-bg rounded-lg border border-marine-border p-3 overflow-x-auto text-xs font-mono text-marine-text leading-relaxed">
        {code}
      </pre>
    </div>
  )
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 bg-marine-panel rounded-lg p-3 border border-marine-border">
      <div className="w-2 h-2 rounded-full bg-marine-accent mt-1.5 flex-shrink-0" />
      <div>
        <div className="text-sm font-sans font-semibold text-marine-text-bright">{title}</div>
        <div className="text-xs font-mono text-marine-text-dim mt-0.5">{desc}</div>
      </div>
    </div>
  )
}

function ApiRow({ data, source, protocol, env }: { data: string; source: string; protocol: string; env: string }) {
  return (
    <tr className="border-b border-marine-border/50 hover:bg-marine-panel-light">
      <td className="py-2 px-3 text-marine-text-bright">{data}</td>
      <td className="py-2 px-3">{source}</td>
      <td className="py-2 px-3 text-marine-blue">{protocol}</td>
      <td className="py-2 px-3">
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
          env === 'Pi' ? 'bg-emerald-500/20 text-emerald-400' :
          'bg-marine-accent/20 text-marine-accent'
        }`}>{env}</span>
      </td>
    </tr>
  )
}

function FlowChart() {
  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-6 mt-4">
      <div className="flex flex-col items-center gap-2 text-xs font-mono">
        {/* Top row: Data sources */}
        <div className="flex flex-wrap gap-3 justify-center">
          <FlowBox label="NMEA 0183" color="blue" />
          <FlowBox label="NMEA 2000" color="blue" />
          <FlowBox label="GPS/AIS" color="blue" />
          <FlowBox label="GPIO" color="green" />
        </div>
        <Arrow />
        <FlowBox label="SignalK Server" color="orange" large />
        <Arrow />
        <FlowBox label="WebSocket API" color="orange" />
        <Arrow />
        <div className="flex gap-3">
          <FlowBox label="React Frontend" color="accent" large />
          <FlowBox label="Express API" color="accent" />
        </div>
        <Arrow />
        <div className="flex gap-3">
          <FlowBox label="7&quot; Pekskärm" color="green" />
          <FlowBox label="Desktop Browser" color="green" />
          <FlowBox label="Rederi Dashboard" color="green" />
        </div>

        {/* Side: External APIs */}
        <div className="mt-4 pt-4 border-t border-marine-border w-full text-center">
          <div className="text-marine-text-dim mb-2">Externa API:er (via 4G/5G)</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <FlowBox label="SMHI" color="blue" />
            <FlowBox label="Trafikverket" color="blue" />
            <FlowBox label="Sjöfartsverket" color="blue" />
            <FlowBox label="OpenSeaMap" color="blue" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FlowBox({ label, color, large }: { label: string; color: string; large?: boolean }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    green: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    orange: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    accent: 'bg-marine-accent/15 border-marine-accent/30 text-marine-accent',
  }
  return (
    <div className={`px-3 py-1.5 rounded-lg border ${colors[color]} ${large ? 'font-bold' : ''}`}>
      {label}
    </div>
  )
}

function Arrow() {
  return <div className="text-marine-text-dim text-lg">↓</div>
}

function HardwareDiagram() {
  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-6 mt-4">
      <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Hårdvarudiagram</div>
      <div className="flex flex-col items-center gap-2 text-xs font-mono">
        <div className="flex gap-4 items-center">
          <FlowBox label="Fartygets NMEA-bus" color="blue" large />
          <span className="text-marine-text-dim">→ USB RS422 →</span>
          <FlowBox label="Raspberry Pi 5" color="accent" large />
        </div>
        <div className="flex gap-6 mt-2">
          <div className="text-center">
            <FlowBox label="7&quot; Pekskärm" color="green" />
            <div className="text-marine-text-dim mt-1">DSI/HDMI</div>
          </div>
          <div className="text-center">
            <FlowBox label="4G Modem" color="orange" />
            <div className="text-marine-text-dim mt-1">USB</div>
          </div>
          <div className="text-center">
            <FlowBox label="GPIO Sensorer" color="green" />
            <div className="text-marine-text-dim mt-1">Bilge, MOB</div>
          </div>
        </div>
      </div>
    </div>
  )
}
