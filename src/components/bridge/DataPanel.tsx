interface DataItemProps {
  label: string
  value: string | number
  unit?: string
  alert?: boolean
}

function DataItem({ label, value, unit, alert }: DataItemProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-marine-text-dim text-[10px] font-mono uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-mono font-bold ${alert ? 'text-marine-red animate-pulse' : 'text-marine-text-bright'}`}>
        {value}
      </span>
      {unit && <span className="text-marine-text-dim text-xs font-mono">{unit}</span>}
    </div>
  )
}

interface DataPanelProps {
  items: DataItemProps[]
  title?: string
}

export function DataPanel({ items, title }: DataPanelProps) {
  return (
    <div className="bg-marine-panel rounded-lg p-3 border border-marine-border">
      {title && (
        <h3 className="text-marine-text-dim text-xs font-mono mb-2 uppercase tracking-wider">{title}</h3>
      )}
      <div className="flex justify-around gap-2">
        {items.map((item) => (
          <DataItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}
