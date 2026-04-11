interface CompassProps {
  heading: number
  cog: number
}

const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

export function Compass({ heading, cog }: CompassProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Outer ring */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#1a3a4a" strokeWidth="2" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="#1a3a4a" strokeWidth="1" />

          {/* Rotating compass rose */}
          <g
            transform={`rotate(${-heading}, 100, 100)`}
            style={{ transition: 'transform 0.5s ease-out' }}
          >
            {/* Degree ticks */}
            {Array.from({ length: 72 }).map((_, i) => {
              const deg = i * 5
              const isMajor = deg % 30 === 0
              const len = isMajor ? 12 : 6
              return (
                <line
                  key={i}
                  x1="100"
                  y1={isMajor ? 10 : 14}
                  x2="100"
                  y2={10 + len}
                  stroke={isMajor ? '#c8d6e5' : '#6b8a9e'}
                  strokeWidth={isMajor ? 2 : 1}
                  transform={`rotate(${deg}, 100, 100)`}
                />
              )
            })}

            {/* Cardinal labels */}
            {CARDINAL.map((label, i) => {
              const deg = i * 45
              const rad = (deg * Math.PI) / 180
              const r = 72
              const x = 100 + r * Math.sin(rad)
              const y = 100 - r * Math.cos(rad)
              const isN = label === 'N'
              return (
                <text
                  key={label}
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill={isN ? '#e74c3c' : '#c8d6e5'}
                  fontSize={isN ? 16 : 12}
                  fontWeight={isN ? 'bold' : 'normal'}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {label}
                </text>
              )
            })}

            {/* North triangle */}
            <polygon points="100,20 96,35 104,35" fill="#e74c3c" />
          </g>

          {/* COG indicator (fixed orange triangle at top) */}
          <polygon
            points="100,6 96,16 104,16"
            fill="#e8891c"
            transform={`rotate(${cog - heading}, 100, 100)`}
            style={{ transition: 'transform 0.5s ease-out' }}
          />

          {/* Ship icon (fixed center) */}
          <g transform="translate(100,100)">
            <line x1="0" y1="-18" x2="0" y2="18" stroke="#e8891c" strokeWidth="3" />
            <line x1="-8" y1="6" x2="0" y2="-18" stroke="#e8891c" strokeWidth="2" />
            <line x1="8" y1="6" x2="0" y2="-18" stroke="#e8891c" strokeWidth="2" />
            <line x1="-10" y1="10" x2="10" y2="10" stroke="#e8891c" strokeWidth="2" />
          </g>

          {/* Heading readout at top center */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#f0f4f8"
            fontSize="28"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            {String(Math.round(heading)).padStart(3, '0')}°
          </text>
        </svg>
      </div>
      <span className="text-marine-text-dim text-xs font-mono mt-1">HDG</span>
    </div>
  )
}
