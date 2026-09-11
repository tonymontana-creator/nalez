import { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

// SSE stream — klient sa pripojí a dostáva live progress
export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let lastProgress = -1
      let attempts = 0
      const maxAttempts = 120 // 2 minúty timeout

      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      const poll = async () => {
        attempts++
        const job = await kv.get<any>(`job:${params.jobId}`)

        if (!job) {
          send({ error: 'Job nenájdený' })
          controller.close()
          return
        }

        if (job.progress !== lastProgress) {
          lastProgress = job.progress
          send({
            progress: job.progress,
            logs: job.logs,
            status: job.status,
          })
        }

        if (job.status === 'done' || job.status === 'error') {
          send({ progress: 100, status: job.status, token: job.token })
          controller.close()
          return
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 1000)
        } else {
          send({ error: 'Timeout' })
          controller.close()
        }
      }

      await poll()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
