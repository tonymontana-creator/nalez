import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const nalez = await kv.get(`nalez:${params.token}`)
  if (!nalez) return NextResponse.json({ error: 'Nález nenájdený' }, { status: 404 })

  // Nevraciame PIN v odpovedi
  const { pin, ...safe } = nalez as any
  return NextResponse.json(safe)
}
