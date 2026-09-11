import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNalezEmail(
  to: string,
  token: string,
  score: number,
  pin: string
) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/n/${token}`
  const scoreColor = score >= 80 ? '#00C853' : score >= 50 ? '#FF9800' : '#FF1744'

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'Nález <noreply@nalez.dev>',
    to,
    subject: `Váš code audit je pripravený — skóre ${score}/100`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1F1F1F;border-radius:12px;overflow:hidden">
        
        <!-- Header -->
        <tr><td style="background:#0070F3;padding:24px 32px">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">Nález<span style="opacity:0.6">_</span></h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px">Code Audit Report</p>
        </td></tr>

        <!-- Score -->
        <tr><td style="padding:32px;text-align:center">
          <div style="display:inline-block;background:#0A0A0A;border:2px solid #1F1F1F;border-radius:50%;width:100px;height:100px;line-height:100px">
            <span style="font-size:28px;font-weight:700;color:${scoreColor}">${score}</span>
          </div>
          <p style="color:#888;font-size:13px;margin:8px 0 0">z 100 bodov</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 32px 32px;text-align:center">
          <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 24px">
            Váš kódový audit je hotový. Prezrite si nálezy a schváľte alebo zamietnte záplaty priamo v prehliadači — bez GitHub účtu.
          </p>
          <a href="${url}" style="display:inline-block;background:#0070F3;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px">
            Zobraziť Nález →
          </a>
        </td></tr>

        <!-- PIN -->
        <tr><td style="padding:20px 32px;background:#0A0A0A;border-top:1px solid #1F1F1F;text-align:center">
          <p style="color:#666;font-size:12px;margin:0 0 8px">Váš PIN pre schvaľovanie</p>
          <div style="background:#111;border:1px solid #1F1F1F;border-radius:6px;display:inline-block;padding:8px 24px">
            <span style="font-family:monospace;font-size:24px;letter-spacing:8px;color:#0070F3;font-weight:700">${pin}</span>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:16px 32px;text-align:center">
          <p style="color:#333;font-size:11px;margin:0">
            Nález · Powered by Mistral AI &amp; Vercel · Link je platný 30 dní
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}
