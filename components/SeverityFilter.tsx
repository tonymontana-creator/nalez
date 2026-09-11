'use client'

const LEVELS = [
  { key: 'all', label: 'Všetky', color: '#888' },
  { key: 'critical', label: 'Kritické', color: '#FF1744' },
  { key: 'high', label: 'Vysoké', color: '#FF9800' },
  { key: 'medium', label: 'Stredné', color: '#FFC107' },
  { key: 'low', label: 'Nízke', color: '#00C853' },
]

interface Props {
  active: string
  onChange: (s: string) => void
  findings: any[]
}

export default function SeverityFilter({ active, onChange, findings }: Props) {
  const count = (key: string) =>
    key === 'all' ? findings.length : findings.filter(f => f.severity === key).length

  return (
    <div className="flex gap-2 flex-wrap">
      {LEVELS.map(l => (
        <button
          key={l.key}
          onClick={() => onChange(l.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            active === l.key
              ? 'text-white border-transparent'
              : 'bg-transparent text-[#666] border-border hover:border-[#444]'
          }`}
          style={active === l.key ? { background: l.color, boxShadow: `0 0 10px ${l.color}40` } : {}}
        >
          {l.label} <span className="opacity-60">({count(l.key)})</span>
        </button>
      ))}
    </div>
  )
}
