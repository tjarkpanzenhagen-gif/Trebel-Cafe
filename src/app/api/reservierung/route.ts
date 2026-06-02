import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { name, contact, date, time, persons, message } = await request.json();

    if (!name?.trim() || !contact?.trim() || !date?.trim()) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    if (String(name).length > 100 || String(contact).length > 100 || String(message ?? "").length > 500) {
      return NextResponse.json({ error: "Eingabe zu lang" }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.NOTIFY_EMAIL ?? user;
    const port = Number(process.env.SMTP_PORT ?? 587);

    if (!host || !user || !pass) {
      return NextResponse.json({ error: "E-Mail nicht konfiguriert" }, { status: 500 });
    }

    const text = [
      "Neue Tischreservierung",
      "",
      `Name:      ${name}`,
      `Kontakt:   ${contact}`,
      `Datum:     ${date}`,
      `Uhrzeit:   ${time} Uhr`,
      `Personen:  ${persons}`,
      message?.trim() ? `Nachricht: ${message}` : "",
      "",
      `Eingegangen: ${new Date().toLocaleString("de-DE")}`,
    ].filter((l) => l !== undefined).join("\n");

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host, port, secure: port === 465, auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"Trebel Café" <${user}>`,
      to,
      subject: `Tischreservierung: ${name} · ${date} ${time} Uhr`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Anfrage konnte nicht gesendet werden" }, { status: 500 });
  }
}
