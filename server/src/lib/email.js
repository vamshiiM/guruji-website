import { Resend } from "resend";
import { env } from "../config/env.js";

// If no API key is configured (e.g. local dev), we log instead of sending so the
// app works end-to-end without email credentials.
const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

// `to`/`replyTo` may be a string or an array (multiple admin recipients).
const hasRecipient = (v) => (Array.isArray(v) ? v.length > 0 : !!v);

async function send({ to, subject, html, replyTo }) {
  if (!resend || !hasRecipient(to)) {
    console.log(`[email:skipped] would send "${subject}" (no recipient or no API key)`);
    return;
  }
  try {
    await resend.emails.send({
      from: env.mailFrom,
      to,
      subject,
      html,
      ...(hasRecipient(replyTo) ? { replyTo } : {}),
    });
  } catch (e) {
    // Never let an email failure break the request that triggered it.
    console.error("[email:failed]", e?.message || e);
  }
}

// Escape user-supplied text before interpolating into HTML email bodies, so a
// malicious name/message can't inject links/markup into a recipient's inbox.
const escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const row = (label, value) =>
  value ? `<p style="margin:4px 0"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>` : "";

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
  // Reply-to the devotee so the admin can respond to them directly.
  return send({ to: env.notifyEmails, replyTo: b.email, subject: `New booking: ${b.service} — ${b.name}`, html });
}

// Confirmation sent to the devotee who booked. Reply-to the business inbox so
// their replies reach the admin, not the unmonitored no-reply address.
export function sendUserBookingConfirmation(b) {
  if (!b.email) return;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#2a2a2a;max-width:540px;margin:0 auto">
      <h2 style="color:#b8860b;margin:0 0 8px">Your booking is received 🙏</h2>
      <p style="margin:0 0 12px">Namaste ${escapeHtml(b.name) || "there"},</p>
      <p style="margin:0 0 16px;line-height:1.6">
        Thank you for booking with <strong>Divya Seva</strong>. We've received your request and
        Pandit&nbsp;Ji will confirm the details with you shortly.
      </p>
      <div style="background:#faf7f0;border:1px solid #eadfc5;border-radius:8px;padding:16px 18px;margin:0 0 16px">
        ${row("Service", b.service)}
        ${row("Date", b.date)}
        ${row("Time", b.time)}
        ${row("Address", b.address)}
      </div>
      <p style="margin:0 0 16px;line-height:1.6">
        If any detail is incorrect, just reply to this email and we'll help.
      </p>
      <p style="margin:20px 0 0;color:#7a6a4f">With devotion,<br/>Divya Seva</p>
    </div>
  `;
  return send({ to: b.email, replyTo: env.notifyEmails, subject: `Booking received — ${b.service}`, html });
}

// Sent to the devotee when the admin confirms or cancels their booking.
// Called only on a real Confirmed/Cancelled transition (see updateBooking).
export function sendBookingStatusUpdate(b) {
  if (!b.email) return;

  const details = `
    <div style="background:#faf7f0;border:1px solid #eadfc5;border-radius:8px;padding:16px 18px;margin:0 0 16px">
      ${row("Service", b.service)}
      ${row("Date", b.date)}
      ${row("Time", b.time)}
      ${row("Address", b.address)}
    </div>`;

  let subject;
  let intro;
  let outro;
  if (b.status === "Confirmed") {
    subject = `Your booking is confirmed — ${b.service}`;
    intro = `Wonderful news — your booking with <strong>Divya Seva</strong> is <strong>confirmed</strong>. Pandit&nbsp;Ji looks forward to performing your ceremony.`;
    outro = `If you need to change anything, just reply to this email and we'll help.`;
  } else if (b.status === "Cancelled") {
    subject = `Your booking has been cancelled — ${b.service}`;
    intro = `Your booking with <strong>Divya Seva</strong> has been <strong>cancelled</strong>.`;
    outro = `If this is unexpected or you'd like to rebook, just reply to this email and we'll be glad to help.`;
  } else {
    // Defensive: only Confirmed/Cancelled are user-facing events.
    return;
  }

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#2a2a2a;max-width:540px;margin:0 auto">
      <h2 style="color:#b8860b;margin:0 0 8px">${b.status === "Confirmed" ? "Booking confirmed 🙏" : "Booking cancelled"}</h2>
      <p style="margin:0 0 12px">Namaste ${escapeHtml(b.name) || "there"},</p>
      <p style="margin:0 0 16px;line-height:1.6">${intro}</p>
      ${details}
      <p style="margin:0 0 16px;line-height:1.6">${outro}</p>
      <p style="margin:20px 0 0;color:#7a6a4f">With devotion,<br/>Divya Seva</p>
    </div>
  `;
  return send({ to: b.email, replyTo: env.notifyEmails, subject, html });
}

export function sendContactNotification(m) {
  const html = `
    <h2>New enquiry</h2>
    ${row("Name", m.name)}
    ${row("Email", m.email)}
    <p style="margin:12px 0 4px"><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(m.message)}</p>
  `;
  return send({ to: env.notifyEmails, replyTo: m.email, subject: `New enquiry from ${m.name}`, html });
}
