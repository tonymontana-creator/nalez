import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { kv } from '@vercel/kv'
import { nanoid } from 'crypto'
import { sendNalezEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('zip') as File
    const email = formData.get('email') as string
    const pin = formData.get('pin') as string || Math.floor(1000 + Math.random() * 9000).toString()

    if (!file || !file.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Vyžaduje sa ZIP súbor' }, { status: 400 })
    }

    // Upload ZIP do Vercel Blob
    const blob = await put(`zips/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Vygeneruj token + jobId
    const token = nanoid(12)
    const jobId = nanoid(8)

    // Ulož job do KV
    await kv.set(`job:${jobId}`, {
      blobUrl: blob.url,
      email,
      pin,
      token,
      status: 'pending',
      progress: 0,
      logs: [],
      createdAt: new Date().toISOString(),
    }, { ex: 60 * 60 * 24 * 7 }) // 7 dní

    // Spusť audit async (fire & forget)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/audit/${jobId}/run`, {
      method: 'POST',
    }).catch(console.error)

    return NextResponse.json({ jobId, token })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload zlyhal' }, { status: 500 })
  }
}
