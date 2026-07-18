import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getClosedDayReason, todayInBerlin } from "@/lib/dates";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`reservierung:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
        { status: 429 }
      );
    }

    const { name, contact, date, time, persons, message } = await request.json();

    if (!name?.trim() || !contact?.trim() || !date?.trim()) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    if (String(name).length > 100 || String(contact).length > 100 || String(message ?? "").length > 500) {
      return NextResponse.json({ error: "Eingabe zu lang" }, { status: 400 });
    }
    if (!DATE_RE.test(String(date))) {
      return NextResponse.json({ error: "Ungültiges Datum" }, { status: 400 });
    }
    if (String(date) < todayInBerlin()) {
      return NextResponse.json({ error: "Das Datum liegt in der Vergangenheit" }, { status: 400 });
    }
    const closedReason = getClosedDayReason(String(date));
    if (closedReason) {
      return NextResponse.json({ error: closedReason }, { status: 400 });
    }
    const safeTime = String(time ?? "");
    if (!TIME_RE.test(safeTime) || safeTime < "09:00" || safeTime > "16:00") {
      return NextResponse.json({ error: "Ungültige Uhrzeit" }, { status: 400 });
    }
    const safePersons = String(persons ?? "").slice(0, 50);

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
      `Uhrzeit:   ${safeTime} Uhr`,
      `Personen:  ${safePersons}`,
      message?.trim() ? `Nachricht: ${message}` : "",
      "",
      `Eingegangen: ${new Date().toLocaleString("de-DE")}`,
    ].join("\n");

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host, port, secure: port === 465, auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"Trebel Café" <${user}>`,
      to,
      subject: `Tischreservierung: ${name} · ${date} ${safeTime} Uhr`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Anfrage konnte nicht gesendet werden" }, { status: 500 });
  }
}
