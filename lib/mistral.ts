import Mistral from '@mistralai/mistralai'

export interface ParsedFile {
  path: string
  content: string
  ext: string
}

export interface Finding {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  file: string
  line: number
  title: string
  description: string
  diff: string
  clientAction?: 'approved' | 'rejected'
  clientNote?: string
}

export interface AuditResult {
  findings: Finding[]
  score: number
  verdict: string
  fileCount: number
  linesScanned: number
}

export async function auditFiles(files: ParsedFile[]): Promise<AuditResult> {
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! })

  // Limituj na prvých 20 súborov, max 300 riadkov každý
  const sample = files.slice(0, 20).map(f => ({
    path: f.path,
    ext: f.ext,
    content: f.content.split('\n').slice(0, 300).join('\n'),
  }))

  const prompt = `Si senior security & code quality auditor. Analyzuj tieto súbory a vráť IBA validný JSON bez markdown blokov.

JSON štruktúra:
{
  "findings": [
    {
      "id": "F001",
      "severity": "critical|high|medium|low",
      "file": "path/to/file.js",
      "line": 42,
      "title": "Krátky názov problému",
      "description": "Detailný popis a dopad",
      "diff": "--- a/file.js\n+++ b/file.js\n@@ -40,7 +40,7 @@\n-problematický kód\n+opravený kód"
    }
  ],
  "score": 73,
  "verdict": "Stručné hodnotenie projektu v 2-3 vetách.",
  "fileCount": ${files.length},
  "linesScanned": ${files.reduce((a, f) => a + f.content.split('\n').length, 0)}
}

Hľadaj: SQL injection, XSS, hardcoded secrets, unused deps, security misconfigs, bad error handling, memory leaks.
Skóre: 100 = perfektný kód, 0 = katastrofa.

Súbory:
${JSON.stringify(sample)}`

  const response = await client.chat.complete({
    model: 'mistral-large-latest',
    messages: [{ role: 'user', content: prompt }],
    responseFormat: { type: 'json_object' },
    temperature: 0.1,
  })

  const raw = response.choices?.[0]?.message?.content ?? '{}'
  const result = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw))

  return {
    findings: result.findings ?? [],
    score: result.score ?? 50,
    verdict: result.verdict ?? 'Audit dokončený.',
    fileCount: result.fileCount ?? files.length,
    linesScanned: result.linesScanned ?? 0,
  }
}
