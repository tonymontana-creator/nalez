'use client'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  email: string
  onJobStart: (jobId: string) => void
}

export default function UploadZone({ email, onJobStart }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setError('Iba ZIP súbory sú podporované.')
      return
    }
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('zip', file)
    fd.append('email', email)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.jobId) {
      onJobStart(data.jobId)
    } else {
      setError(data.error || 'Upload zlyhal')
      setUploading(false)
    }
  }, [email, onJobStart])

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
      onClick={() => document.getElementById('zip-input')?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
        ${ dragging ? 'border-brand bg-brand/10 shadow-glow' : 'border-border hover:border-brand/50 hover:bg-surface' }
      `}
    >
      <input
        id="zip-input"
        type="file"
        accept=".zip"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}
      />
      {uploading ? (
        <div className="space-y-2">
          <div className="text-3xl animate-bounce">📦</div>
          <p className="text-brand font-medium">Nahrávam ZIP...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-5xl">{dragging ? '🎯' : '📁'}</div>
          <p className="text-white font-semibold text-lg">
            {dragging ? 'Pusť tu!' : 'Pretiahni ZIP alebo klikni'}
          </p>
          <p className="text-[#555] text-sm">Podporované: .zip s akýmkoľvek kódom</p>
        </div>
      )}
      {error && <p className="mt-4 text-danger text-sm">{error}</p>}
    </div>
  )
}
