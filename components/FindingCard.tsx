'use client'
import { useState } from 'react'

const SEV_COLORS: Record<string, string> = {
  critical: '#FF1744',
  high: '#FF9800',
  medium: '#FFC107',
  low: '#00C853',
}

interface Props {
  finding: any
  token: string
  pin: string
  onUpdate: (nalez: any) => void
}

export default function FindingCard({ finding, token, pin, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState(finding.clientNote || '')
  const [saving, setSaving] = useState(false)
  const color = SEV_COLORS[finding.severity] ?? '#888'

  const act = async (action: 'approved' | 'rejected') => {
    setSaving(true)
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, pin, action, note, findingId: finding.id }),
    })
    const data = await res.json()
    if (data.ok) {
      const updated = await fetch(`/api/nalez/${token}`).then(r => r.json())
      onUpdate(updated)
    }
    setSaving(false)
  }

  const statusIcon = finding.clientAction === 'approved' ? '✅' : finding.clientAction === 'rejected' ? '❌' : null

  return (
    <div className={`bg-surface border rounded-xl overflow-hidden transition-all ${
      finding.clientAction === 'approved' ? 'border-success/40' :
      finding.clientAction === 'rejected' ? 'border-danger/40' : 'border-border'
    }`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <span
          className="mt-0.5 text-xs font-bold uppercase px-2 py-0.5 rounded shrink-0"
          style={{ background: `${color}20`, color }}
        >
          {finding.severity}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">{finding.title}</p>
          <p className="text-[#555] text-xs mt-0.5 truncate">{finding.file}:{finding.line}</p>
        </div>
        {statusIcon && <span className="text-lg">{statusIcon}</span>}
        <span className="text-[#444] text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Rozbalený detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-[#aaa] text-sm leading-relaxed">{finding.description}</p>

          {finding.diff && (
            <pre className="bg-[#0A0A0A] border border-border rounded-lg p-3 text-xs overflow-x-auto font-mono text-[#888] whitespace-pre-wrap">
              {finding.diff.split('\n').map((line: string, i: number) => (
                <span
                  key={i}
                  className={line.startsWith('+') ? 'text-success block' : line.startsWith('-') ? 'text-danger block' : 'block'}
                >
                  {line}
                </span>
              ))}
            </pre>
          )}

          {!finding.clientAction && (
            <div className="space-y-2">
              <textarea
                placeholder="Poznámka (voliteľné)..."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                className="w-full bg-[#0A0A0A] border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-brand resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => act('approved')}
                  disabled={saving}
                  className="flex-1 bg-success/20 text-success border border-success/30 rounded-lg py-2 text-sm font-semibold hover:bg-success/30 transition-colors disabled:opacity-50"
                >
                  {saving ? '...' : '✅ Schváliť záplatu'}
                </button>
                <button
                  onClick={() => act('rejected')}
                  disabled={saving}
                  className="flex-1 bg-danger/20 text-danger border border-danger/30 rounded-lg py-2 text-sm font-semibold hover:bg-danger/30 transition-colors disabled:opacity-50"
                >
                  {saving ? '...' : '❌ Zamietnuť'}
                </button>
              </div>
            </div>
          )}

          {finding.clientAction && (
            <div className={`rounded-lg p-3 text-sm ${
              finding.clientAction === 'approved' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}>
              {finding.clientAction === 'approved' ? '✅ Záplata schválená' : '❌ Zamietnuté'}
              {finding.clientNote && <p className="text-[#888] mt-1">{finding.clientNote}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
