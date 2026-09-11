import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nález — ZIP Audit',
  description: 'Nahraj ZIP, dostaneš AI audit, klient schváli záplaty jedným kliknutím.',
  manifest: '/manifest.json',
  themeColor: '#0070F3',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nález',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  )
}
