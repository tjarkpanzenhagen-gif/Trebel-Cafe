import type { Booking } from "@/lib/bookings-store";

// Configure via Vercel env vars:
//   SMTP_HOST     e.g. mail.gmx.net
//   SMTP_PORT     e.g. 587
//   SMTP_USER     e.g. trebelcafe@gmx.de
//   SMTP_PASS     GMX password or app password
//   NOTIFY_EMAIL  recipient, defaults to SMTP_USER

export async function sendBookingNotification(booking: Booking): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return; // not configured — skip silently

  const port = Number(process.env.SMTP_PORT ?? 587);
  const to = process.env.NOTIFY_EMAIL ?? user;

  const extras = [
    booking.extras.kinderbett ? "Kinderbett" : "",
    booking.extras.aufbettung ? "Aufbettung" : "",
  ].filter(Boolean).join(", ");

  const text = [
    `Neue Buchungsanfrage — ${booking.apartmentName}`,
    "",
    `Name:      ${booking.name}`,
    `E-Mail:    ${booking.email}`,
    `Telefon:   ${booking.phone}`,
    `Anreise:   ${booking.checkIn}`,
    `Abreise:   ${booking.checkOut}`,
    `Nächte:    ${booking.nights}`,
    `Personen:  ${booking.persons}`,
    extras ? `Extras:    ${extras}` : "",
    `Gesamt:    ${booking.estimatedTotal.toFixed(2)} €`,
    booking.message ? `\nNachricht: ${booking.message}` : "",
    "",
    `Buchungs-ID: ${booking.id}`,
    `Eingegangen: ${new Date(booking.createdAt).toLocaleString("de-DE")}`,
  ].filter((l) => l !== undefined).join("\n");

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"Trebel Café" <${user}>`,
      to,
      subject: `Neue Anfrage: ${booking.apartmentName} · ${booking.checkIn}`,
      text,
    });
  } catch {
    // Email failure must never break the booking flow
  }
}
