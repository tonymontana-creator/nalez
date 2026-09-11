# Nález_

> ZIP → AI Audit → Klientský Nález. PWA s Approve/Reject, bez GitHub účtu.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tonymontana-creator/nalez)

## Čo to robí

1. **Nahraj ZIP** — pretiahni archív so zdrojovým kódom
2. **AI Audit** — Mistral Large analyzuje kód (security, quality, dependencies)
3. **Animovaný progress** — SSE live stream s logmi a % úspešnosti  
4. **Nález link** — unikátny `/n/:token` link poslaný emailom (Resend)
5. **Klient schváli** — PIN chránená PWA stránka, Approve/Reject per finding
6. **Žiadny Slack ping** — developer vie presne čo je schválené

## Stack

| Vrstva | Technológia |
|--------|------------|
| Framework | Next.js 14 (App Router) |
| Deploy | Vercel |
| AI | Mistral Large Latest |
| Email | Resend |
| State | Vercel KV (Redis) |
| Storage | Vercel Blob |
| Offline | Service Worker + localStorage |
| Štýl | Tailwind CSS + Vercel/Resend design tokens |

## Setup

```bash
npm install
cp .env.example .env.local
# Vyplň .env.local
npm run dev
```

## Environment Variables

Pozri `.env.example` — potrebuješ:
- `MISTRAL_API_KEY` — [console.mistral.ai](https://console.mistral.ai)
- `RESEND_API_KEY` — [resend.com](https://resend.com)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` — Vercel KV (Storage tab)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (Storage tab)

## Deploy na Vercel

```bash
npx vercel
# Pridaj env vars v Vercel dashboarde
# Vytvor KV a Blob storage v Storage tab
```

## Architektúra

```
Upload ZIP
    ↓
Vercel Blob (uloženie)
    ↓
KV Job (stav auditu)
    ↓
Mistral Large (analýza)
    ↓  
SSE stream → ProgressBar + AuditLog
    ↓
Nález KV + Resend email
    ↓
/n/:token (PIN chránená PWA)
    ↓
Approve/Reject → KV update
```

## Cesta klienta

1. Dostane email s linkom + PIN
2. Otvorí na mobile (inštaluje ako PWA ikonu)
3. Zadá 4-ciferný PIN
4. Vidí skóre, filtruje severity, číta diffy
5. Jedným kliknutím schváli alebo zamietne
6. Developer dostane jasný verdikt — žiadny Slack

---

Made with ❤️ in Košice
