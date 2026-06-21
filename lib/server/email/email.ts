import 'server-only'

import nodemailer, { type Transporter } from 'nodemailer'

import { isSmtpConfigured, serverEnvironment } from '@/lib/server/env'

let cachedTransporter: Transporter | null = null

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter
  cachedTransporter = nodemailer.createTransport({
    host: serverEnvironment.SMTP_HOST,
    port: serverEnvironment.SMTP_PORT,
    // STARTTLS on 587, implicit TLS on 465.
    secure: serverEnvironment.SMTP_PORT === 465,
    auth: {
      user: serverEnvironment.SMTP_USER,
      pass: serverEnvironment.SMTP_PASSWORD,
    },
  })
  return cachedTransporter
}

export interface EnquiryEmailPayload {
  name: string
  email: string
  company: string | null
  phone: string | null
  country: string
  message: string
  localeSent: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function plainText(input: EnquiryEmailPayload): string {
  const lines = [
    `Name:    ${input.name}`,
    `Email:   ${input.email}`,
    `Country: ${input.country}`,
    input.company ? `Company: ${input.company}` : null,
    input.phone ? `Phone:   ${input.phone}` : null,
    `Locale:  ${input.localeSent}`,
    '',
    '--- Message ---',
    input.message,
  ]
  return lines.filter((line) => line !== null).join('\n')
}

function html(input: EnquiryEmailPayload): string {
  const safe = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    company: input.company ? escapeHtml(input.company) : null,
    phone: input.phone ? escapeHtml(input.phone) : null,
    country: escapeHtml(input.country),
    locale: escapeHtml(input.localeSent),
    // Preserve line breaks in the message but escape HTML.
    message: escapeHtml(input.message).replace(/\n/g, '<br>'),
  }
  const rows = [
    ['Name', safe.name],
    ['Email', `<a href="mailto:${safe.email}">${safe.email}</a>`],
    ['Country', safe.country],
    safe.company ? ['Company', safe.company] : null,
    safe.phone
      ? ['Phone', `<a href="tel:${safe.phone}">${safe.phone}</a>`]
      : null,
    ['Locale', safe.locale],
  ].filter((row): row is [string, string] => row !== null)

  const detailRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;font:13px/1.4 system-ui,sans-serif;vertical-align:top">${label}</td><td style="padding:6px 0;font:13px/1.4 system-ui,sans-serif;color:#111">${value}</td></tr>`,
    )
    .join('')

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f7f5f1;font-family:system-ui,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e1d8;border-radius:12px;padding:24px">
    <h1 style="margin:0 0 16px;font:500 18px system-ui,sans-serif;color:#111">New enquiry — BACA</h1>
    <table style="border-collapse:collapse;width:100%">${detailRows}</table>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee">
      <p style="margin:0 0 6px;font:12px/1 system-ui,sans-serif;color:#666;text-transform:uppercase;letter-spacing:0.08em">Message</p>
      <p style="margin:0;font:14px/1.5 system-ui,sans-serif;color:#111;white-space:pre-wrap">${safe.message}</p>
    </div>
  </div>
</body></html>`
}

/**
 * Send an enquiry-notification email to the BACA team. Best-effort: failures
 * are logged and swallowed so the form submission never fails because of email
 * trouble (the DB row is the source of truth). Returns `true` on success,
 * `false` if SMTP isn't configured or the send threw.
 */
export async function sendEnquiryNotification(
  payload: EnquiryEmailPayload,
): Promise<boolean> {
  if (!isSmtpConfigured) {
    console.warn(
      '[email] SMTP not configured (set SMTP_HOST/SMTP_USER/SMTP_PASSWORD/SMTP_FROM/ENQUIRY_NOTIFY_TO); enquiry email skipped.',
    )
    return false
  }

  try {
    await getTransporter().sendMail({
      from: serverEnvironment.SMTP_FROM,
      to: serverEnvironment.ENQUIRY_NOTIFY_TO,
      // Set replyTo so the team can hit "Reply" and write back to the buyer.
      replyTo: payload.email,
      subject: `New enquiry from ${payload.name} (${payload.localeSent.toUpperCase()})`,
      text: plainText(payload),
      html: html(payload),
    })
    return true
  } catch (error) {
    console.error('[email] sendEnquiryNotification failed:', error)
    return false
  }
}
