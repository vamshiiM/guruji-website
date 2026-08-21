import { Resend } from "resend";
import { env } from "../config/env.js";

// If no API key is configured (e.g. local dev), we log instead of sending so the
// app works end-to-end without email credentials.
const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

async function send({ subject, html }) {
  if (!resend || !env.notifyEmail) {
    console.log(`[email:skipped] would send "${subject}" to ${env.notifyEmail || "(no NOTIFY_EMAIL)"}`);
    return;
  }
  try {
    await resend.emails.send({
      from: env.mailFrom,
      to: env.notifyEmail,
      subject,
      html,
    });
  } catch (e) {
    // Never let an email failure break the request that triggered it.
    console.error("[email:failed]", e?.message || e);
  }
}

const row = (label, value) =>
  value ? `<p style="margin:4px 0"><strong>${label}:</strong> ${value}</p>` : "";

export function sendBookingNotification(b) {
  const html = `
    <h2>New booking request</h2>
    ${row("Service", b.service)}
    ${row("Name", b.name)}
    ${row("Email", b.email)}
    ${row("Phone", b.phone)}
    ${row("Date", b.date)}
    ${row("Time", b.time)}
    ${row("Address", b.address)}
    ${row("Notes", b.notes)}
  `;
  return send({ subject: `New booking: ${b.service} — ${b.name}`, html });
}

export function sendContactNotification(m) {
  const html = `
    <h2>New enquiry</h2>
    ${row("Name", m.name)}
    ${row("Email", m.email)}
    <p style="margin:12px 0 4px"><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${m.message}</p>
  `;
  return send({ subject: `New enquiry from ${m.name}`, html });
}
