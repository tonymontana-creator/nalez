import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(req: NextRequest) {
  const { token, pin, action, note, findingId } = await req.json()

  const nalez = await kv.get<any>(`nalez:${token}`)
  if (!nalez) return NextResponse.json({ error: 'Nález nenájdený' }, { status: 404 })

  // PIN overenie
  if (nalez.pin !== pin) {
    return NextResponse.json({ error: 'Nesprávny PIN' }, { status: 401 })
  }

  if (findingId) {
    // Schvaľ/zamietni jednotlivý nález
    const updatedFindings = nalez.findings.map((f: any) =>
      f.id === findingId ? { ...f, clientAction: action, clientNote: note } : f
    )
    await kv.set(`nalez:${token}`, { ...nalez, findings: updatedFindings }, { keepTtl: true })
  } else {
    // Schvaľ/zamietni celý audit
    await kv.set(`nalez:${token}`, {
      ...nalez,
      status: action, // 'approved' | 'rejected'
      clientNote: note,
      decidedAt: new Date().toISOString(),
    }, { keepTtl: true })
  }

  return NextResponse.json({ ok: true })
}
