import JSZip from 'jszip'
import type { ParsedFile } from './mistral'

const ALLOWED_EXTENSIONS = [
  'js', 'ts', 'jsx', 'tsx', 'py', 'php', 'rb', 'go', 'java',
  'cs', 'cpp', 'c', 'h', 'vue', 'svelte', 'html', 'css', 'scss',
  'json', 'yaml', 'yml', 'env', 'sh', 'sql', 'md',
]

const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'vendor']

export async function parseZip(buffer: ArrayBuffer): Promise<ParsedFile[]> {
  const zip = await JSZip.loadAsync(buffer)
  const files: ParsedFile[] = []

  for (const [path, file] of Object.entries(zip.files)) {
    if (file.dir) continue

    // Preskočí zakázané adresáre
    if (SKIP_DIRS.some(d => path.includes(`/${d}/`) || path.startsWith(`${d}/`))) continue

    const ext = path.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) continue

    try {
      const content = await file.async('text')
      if (content.length < 10) continue // preskočí prázdne súbory

      files.push({ path, content, ext })
    } catch {
      // Binárne súbory ignorujeme
    }
  }

  return files
}
