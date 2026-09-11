'use client'
import { useEffect, useState } from 'react'

interface Props {
  jobId: string
  onComplete: (token: string) => void
}

export default function ProgressBar({ jobId, onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>('running')

  useEffect(() => {
    const es = new EventSource(`/api/audit/${jobId}`)
    es.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setProgress(data.progress ?? 0)
      if (data.status) setStatus(data.status)
      if (data.status === 'done' && data.token) {
        es.close()
        onComplete(data.token)
      }
    }
    es.onerror = () => es.close()
    return () => es.close()
  }, [jobId, onComplete])

  const color = status === 'error' ? '#FF1744' : status === 'done' ? '#00C853' : '#0070F3'

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-[#888]">
          {status === 'done' ? '✅ Hotovo' : status === 'error' ? '❌ Chyba' : '🔄 Analyzujem...'}
        </span>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {progress}%
        </span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  )
}
