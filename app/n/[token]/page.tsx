'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ScoreCircle from '@/components/ScoreCircle'
import FindingCard from '@/components/FindingCard'
import ApproveRejectBar from '@/components/ApproveRejectBar'
import SeverityFilter from '@/components/SeverityFilter'

export default function NalezPage() {
  const { token } = useParams<{ token: string }>()
  const [nalez, setNalez] = useState<any>(null)
  const [pin, setPin] = useState('')
  const [pinOk, setPinOk] = useState(false)
  const [severity, setSeverity] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cache do localStorage pre offline
    const cached = localStorage.getItem(`nalez:${token}`)
    if (cached) {
      setNalez(JSON.parse(cached))
      setLoading(false)
    }
    fetch(`/api/nalez/${token}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setNalez(data)
          localStorage.setItem(`nalez:${token}`, JSON.stringify(data))
        }
        setLoading(false)
      })
  }, [token])

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-brand animate-pulse text-xl">Načítavam Nález...</div>
    </div>
  )

  if (!nalez) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-danger">Nález neexistuje alebo vypršal.</div>
    </div>
  )

  if (!pinOk) return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 p-6">
      <div className="text-3xl">🔐</div>
      <h1 className="text-xl font-bold">Zadaj PIN</h1>
      <p className="text-[#666] text-sm text-center">PIN ti bol zaslaný emailom spolu s týmto odkazom.</p>
      <input
        type="number"
        maxLength={4}
        placeholder="4-ciferný PIN"
        value={pin}
        onChange={e => setPin(e.target.value)}
        className="bg-surface border border-border rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest w-40 focus:outline-none focus:border-brand"
      />
      <button
        onClick={() => {
          fetch('/api/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, pin, action: 'verify', note: '' }),
          }).then(r => r.json()).then(d => {
            if (d.ok !== false) setPinOk(true)
            else alert('Nesprávny PIN')
          })
        }}
        className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Otvoriť Nález
      </button>
    </div>
  )

  const filtered = severity === 'all'
    ? nalez.findings
    : nalez.findings.filter((f: any) => f.severity === severity)

  return (
    <div className="max-w-lg mx-auto p-4 pb-32 space-y-4">
      {/* Header */}
      <div className="text-center pt-6 pb-2">
        <h1 className="text-2xl font-bold">Nález<span className="text-brand">_</span></h1>
        <p className="text-[#666] text-xs mt-1">{nalez.createdAt?.split('T')[0]}</p>
      </div>

      {/* Score */}
      <ScoreCircle score={nalez.score} verdict={nalez.verdict} />

      {/* Filter */}
      <SeverityFilter active={severity} onChange={setSeverity} findings={nalez.findings} />

      {/* Nálezy */}
      {filtered.map((f: any) => (
        <FindingCard key={f.id} finding={f} token={token} pin={pin} onUpdate={setNalez} />
      ))}

      {/* Approve/Reject celého auditu */}
      <ApproveRejectBar token={token} pin={pin} status={nalez.status} />
    </div>
  )
}
