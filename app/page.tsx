'use client'
import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import ProgressBar from '@/components/ProgressBar'
import AuditLog from '@/components/AuditLog'

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null)
  const [nalezToken, setNalezToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-8 p-6">
      {/* Logo */}
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Nález<span className="text-brand animate-pulse">_</span>
        </h1>
        <p className="text-[#666] mt-2 text-sm">
          ZIP → AI Audit → Klient schváli záplaty
        </p>
      </div>

      {/* Upload alebo Progress */}
      {!jobId ? (
        <div className="w-full max-w-xl space-y-4">
          <input
            type="email"
            placeholder="Email klienta (kam poslať nález)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-brand transition-colors"
          />
          <UploadZone email={email} onJobStart={setJobId} />
        </div>
      ) : (
        <div className="w-full max-w-xl space-y-4">
          <ProgressBar jobId={jobId} onComplete={setNalezToken} />
          <AuditLog jobId={jobId} />
        </div>
      )}

      {/* Hotový nález */}
      {nalezToken && (
        <div className="w-full max-w-xl bg-surface border border-border rounded-xl p-6 text-center space-y-4">
          <div className="text-4xl">✅</div>
          <h2 className="text-xl font-bold">Audit dokončený!</h2>
          <p className="text-[#888] text-sm">Link bol poslaný klientovi emailom. Môžeš ho aj skopírovať:</p>
          <div className="bg-[#0A0A0A] border border-border rounded-lg px-4 py-3 font-mono text-brand text-sm break-all">
            {process.env.NEXT_PUBLIC_APP_URL}/n/{nalezToken}
          </div>
          <a
            href={`/n/${nalezToken}`}
            className="inline-block bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Zobraziť Nález →
          </a>
        </div>
      )}

      {/* Footer */}
      <p className="text-[#333] text-xs">
        Powered by Mistral AI · Vercel · Resend
      </p>
    </main>
  )
}
