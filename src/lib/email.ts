import type { Booking } from "@/lib/bookings-store";

// Configure via Vercel env vars:
//   SMTP_HOST     e.g. mail.gmx.net
//   SMTP_PORT     e.g. 587
//   SMTP_USER     e.g. trebelcafe@gmx.de
//   SMTP_PASS     GMX password or app password
//   NOTIFY_EMAIL  recipient for cafe notifications, defaults to SMTP_USER

async function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const nodemailer = await import("nodemailer");
  return {
    mailer: nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    }),
    user,
  };
}

export async function sendBookingNotification(booking: Booking): Promise<void> {
  try {
    const t = await createTransporter();
    if (!t) return;
    const to = process.env.NOTIFY_EMAIL ?? t.user;

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
      "",
      "─────────────────────────────────────",
      "Bitte Anfrage im Admin-Panel bestätigen oder ablehnen:",
      "https://dastrebelcafetribsees.de/admin",
      "─────────────────────────────────────",
    ].filter((l) => l !== undefined).join("\n");

    await t.mailer.sendMail({
      from: `"Trebel Café" <${t.user}>`,
      to,
      subject: `Neue Anfrage: ${booking.apartmentName} · ${booking.checkIn}`,
      text,
    });
  } catch {
    // Email failure must never break the booking flow
  }
}

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  try {
    const t = await createTransporter();
    if (!t) return;

    const extras = [
      booking.extras.kinderbett ? "Kinderbett" : "",
      booking.extras.aufbettung ? "Aufbettung" : "",
    ].filter(Boolean).join(", ");

    const text = [
      `Hallo ${booking.name},`,
      "",
      "wir freuen uns, Ihre Buchungsanfrage bestätigen zu können!",
      "",
      "Ihre Buchungsdetails:",
      "─────────────────────────────────────",
      `Unterkunft: ${booking.apartmentName}`,
      `Anreise:    ${booking.checkIn}`,
      `Abreise:    ${booking.checkOut}`,
      `Nächte:     ${booking.nights}`,
      `Personen:   ${booking.persons}`,
      extras ? `Extras:     ${extras}` : "",
      `Gesamtpreis (ca.): ${booking.estimatedTotal.toFixed(2)} €`,
      "─────────────────────────────────────",
      "",
      "Bei Fragen erreichen Sie uns unter:",
      "trebelcafe@gmx.de",
      "038320 649921",
      "",
      "Wir freuen uns auf Ihren Besuch!",
      "",
      "Herzliche Grüße",
      "Ihr Trebel Café Tribsees",
    ].filter((l) => l !== undefined).join("\n");

    await t.mailer.sendMail({
      from: `"Trebel Café" <${t.user}>`,
      to: booking.email,
      subject: `Buchungsbestätigung — ${booking.apartmentName} · ${booking.checkIn}`,
      text,
    });
  } catch {
    // Email failure must never break the status update
  }
}

export async function sendBookingCancellation(booking: Booking): Promise<void> {
  try {
    const t = await createTransporter();
    if (!t) return;

    const text = [
      `Hallo ${booking.name},`,
      "",
      "leider müssen wir Ihnen mitteilen, dass wir Ihre Buchungsanfrage",
      "für die folgende Unterkunft nicht annehmen können:",
      "",
      `Unterkunft: ${booking.apartmentName}`,
      `Anreise:    ${booking.checkIn}`,
      `Abreise:    ${booking.checkOut}`,
      "",
      "Falls Sie Fragen haben oder einen alternativen Termin finden möchten,",
      "erreichen Sie uns gerne unter:",
      "trebelcafe@gmx.de",
      "038320 649921",
      "",
      "Wir hoffen, Sie bald bei uns begrüßen zu dürfen.",
      "",
      "Herzliche Grüße",
      "Ihr Trebel Café Tribsees",
    ].join("\n");

    await t.mailer.sendMail({
      from: `"Trebel Café" <${t.user}>`,
      to: booking.email,
      subject: `Ihre Anfrage — ${booking.apartmentName} · ${booking.checkIn}`,
      text,
    });
  } catch {
    // Email failure must never break the status update
  }
}
