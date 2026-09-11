import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { auditFiles } from '@/lib/mistral'
import { parseZip } from '@/lib/audit-engine'
import { sendNalezEmail } from '@/lib/resend'

async function updateJob(jobId: string, patch: object) {
  const job = await kv.get<any>(`job:${jobId}`)
  await kv.set(`job:${jobId}`, { ...job, ...patch }, { ex: 60 * 60 * 24 * 7 })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params

  try {
    const job = await kv.get<any>(`job:${jobId}`)
    if (!job) return NextResponse.json({ error: 'Job nenájdený' }, { status: 404 })

    // Krok 1: Stiahni ZIP
    await updateJob(jobId, { progress: 10, logs: ['📦 Sťahujem ZIP...'] })
    const zipRes = await fetch(job.blobUrl)
    const zipBuffer = await zipRes.arrayBuffer()

    // Krok 2: Rozbaľ súbory
    await updateJob(jobId, { progress: 25, logs: [...(await kv.get<any>(`job:${jobId}`)).logs, '🔍 Rozbaľujem a skenujeme súbory...'] })
    const files = await parseZip(zipBuffer)

    // Krok 3: Mistral audit
    await updateJob(jobId, { progress: 45, logs: [...(await kv.get<any>(`job:${jobId}`)).logs, '🤖 Mistral AI analyzuje kód...'] })
    const auditResult = await auditFiles(files)

    // Krok 4: Ulož nález
    await updateJob(jobId, { progress: 80, logs: [...(await kv.get<any>(`job:${jobId}`)).logs, '📊 Generujem Nález...'] })
    await kv.set(`nalez:${job.token}`, {
      ...auditResult,
      pin: job.pin,
      email: job.email,
      status: 'pending',
      clientNote: '',
      createdAt: new Date().toISOString(),
    }, { ex: 60 * 60 * 24 * 30 }) // 30 dní

    // Krok 5: Email
    await updateJob(jobId, { progress: 90, logs: [...(await kv.get<any>(`job:${jobId}`)).logs, '📧 Posielam email klientovi...'] })
    if (job.email) {
      await sendNalezEmail(job.email, job.token, auditResult.score, job.pin)
    }

    // Hotovo
    await updateJob(jobId, {
      progress: 100,
      status: 'done',
      logs: [...(await kv.get<any>(`job:${jobId}`)).logs, '✅ Audit dokončený!'],
    })

    return NextResponse.json({ ok: true, token: job.token })
  } catch (err) {
    console.error('Audit run error:', err)
    await updateJob(jobId, { status: 'error', logs: [`❌ Chyba: ${err}`] })
    return NextResponse.json({ error: 'Audit zlyhal' }, { status: 500 })
  }
}
