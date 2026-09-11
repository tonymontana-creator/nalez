'use client'
import { useState } from 'react'

interface Props {
  token: string
  pin: string
  status: string
}

export default function ApproveRejectBar({ token, pin, status }: Props) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  if (status === 'approved' || done) return (
    <div className="fixed bottom-0 left-0 right-0 bg-success/20 border-t border-success/30 p-4 text-center">
      <p className="text-success font-semibold">✅ Audit schválený — developer môže mergnúť</p>
    </div>
  )

  if (status === 'rejected') return (
    <div className="fixed bottom-0 left-0 right-0 bg-danger/20 border-t border-danger/30 p-4 text-center">
      <p className="text-danger font-semibold">❌ Audit zamietnutý</p>
    </div>
  )

  const act = async (action: 'approved' | 'rejected') => {
    setSaving(true)
    await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, pin, action, note }),
    })
    setSaving(false)
    setDone(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur border-t border-border p-4 space-y-3">
      <textarea
        placeholder="Celková poznámka k auditu (voliteľné)..."
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-brand resize-none max-w-lg mx-auto block"
      />
      <div className="flex gap-3 max-w-lg mx-auto">
        <button
          onClick={() => act('approved')}
          disabled={saving}
          className="flex-1 bg-brand text-white rounded-xl py-3.5 font-bold text-base hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-glow"
        >
          {saving ? '...' : '✅ Schváliť všetko'}
        </button>
        <button
          onClick={() => act('rejected')}
          disabled={saving}
          className="flex-1 bg-surface text-danger border border-danger/40 rounded-xl py-3.5 font-bold text-base hover:bg-danger/10 transition-colors disabled:opacity-50"
        >
          {saving ? '...' : '❌ Zamietnuť'}
        </button>
      </div>
    </div>
  )
}
