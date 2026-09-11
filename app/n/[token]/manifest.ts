import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return Response.json({
    name: 'Nález',
    short_name: 'Nález',
    description: 'Klientský audit schvaľovač',
    start_url: req.url.replace('/manifest.ts', ''),
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0070F3',
    orientation: 'portrait',
    icons: [
      { src: '/icons/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  })
}
