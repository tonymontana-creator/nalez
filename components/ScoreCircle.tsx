'use client'

interface Props {
  score: number
  verdict?: string
}

export default function ScoreCircle({ score, verdict }: Props) {
  const color = score >= 80 ? '#00C853' : score >= 50 ? '#FF9800' : '#FF1744'
  const radius = 54
  const circ = 2 * Math.PI * radius
  const dash = (score / 100) * circ

  return (
    <div className="bg-surface border border-border rounded-xl p-6 text-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1F1F1F" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ transition: 'stroke-dasharray 1s ease-out', filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="70" y="70" textAnchor="middle" dy="0.35em" fill={color} fontSize="32" fontWeight="700" fontFamily="monospace">
          {score}
        </text>
        <text x="70" y="95" textAnchor="middle" fill="#666" fontSize="11" fontFamily="sans-serif">
          / 100
        </text>
      </svg>
      {verdict && <p className="text-[#aaa] text-sm mt-3 leading-relaxed">{verdict}</p>}
    </div>
  )
}
