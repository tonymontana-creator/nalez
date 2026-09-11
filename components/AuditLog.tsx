'use client'
import { useEffect, useRef, useState } from 'react'

interface Props { jobId: string }

export default function AuditLog({ jobId }: Props) {
  const [logs, setLogs] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const es = new EventSource(`/api/audit/${jobId}`)
    es.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.logs) setLogs(data.logs)
      if (data.status === 'done' || data.status === 'error') es.close()
    }
    es.onerror = () => es.close()
    return () => es.close()
  }, [jobId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="bg-surface border border-border rounded-xl p-4 h-48 overflow-y-auto font-mono text-sm">
      {logs.length === 0 ? (
        <p className="text-[#444]">Čakám na logy...</p>
      ) : (
        logs.map((log, i) => (
          <div key={i} className="text-[#aaa] py-0.5 animate-fade-in">
            <span className="text-[#444] mr-2">{String(i + 1).padStart(2, '0')}</span>
            {log}
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}
