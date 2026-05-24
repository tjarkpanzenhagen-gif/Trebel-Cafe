"use client";

import { useState, useMemo, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-utils";
import { calculatePrice } from "@/lib/fewo-utils";

type Props = {
  apartmentName: string;
  apartmentId: string;
  pricing: ApartmentPricing;
  discounts: ApartmentDiscounts;
  blockedDates: string[];
  bookedDates: string[];
};

function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getNights(from: Date | undefined, to: Date | undefined): number {
  if (!from || !to) return 0;
  const diff = to.getTime() - from.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function hasInvalidInRange(
  from: Date | undefined,
  to: Date | undefined,
  blockedDates: string[],
  bookedDates: string[]
): boolean {
  if (!from || !to) return false;
  const blocked = new Set(blockedDates);
  const booked = new Set(bookedDates);
  for (let d = new Date(from); d < to; d.setDate(d.getDate() + 1)) {
    const key = localDateKey(d);
    if (blocked.has(key) || booked.has(key)) return true;
  }
  return false;
}

export default function BookingForm({
  apartmentName,
  apartmentId,
  pricing,
  discounts,
  blockedDates,
  bookedDates,
}: Props) {
  const showAufbettung = pricing.aufbettungFee > 0;

  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [persons, setPersons] = useState(1);
  const [extras, setExtras] = useState({ kinderbett: false, aufbettung: false });
  const [kinderbettStatus, setKinderbettStatus] = useState<{
    available: boolean;
    nextAvailableDate?: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const checkIn = range.from ? localDateKey(range.from) : "";
  const checkOut = range.to ? localDateKey(range.to) : "";
  const nights = getNights(range.from, range.to);

  useEffect(() => {
    if (!extras.kinderbett || !checkIn || !checkOut) {
      setKinderbettStatus(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/fewo/kinderbett-availability?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setKinderbettStatus(data);
      })
      .catch(() => {
        if (!cancelled) setKinderbettStatus(null);
      });
    return () => { cancelled = true; };
  }, [extras.kinderbett, checkIn, checkOut]);

  const bookedDateObjs = useMemo(
    () => bookedDates.map((d) => new Date(d + "T00:00:00")),
    [bookedDates]
  );

  const blockedDateObjs = useMemo(
    () => blockedDates.map((d) => new Date(d + "T00:00:00")),
    [blockedDates]
  );

  const rangeError =
    checkIn && checkOut && hasInvalidInRange(range.from, range.to, blockedDates, bookedDates)
      ? "Der gewählte Zeitraum enthält gesperrte oder gebuchte Tage."
      : "";

  const kinderbettError =
    extras.kinderbett && kinderbettStatus && !kinderbettStatus.available
      ? `Kinderbett bereits vergeben${kinderbettStatus.nextAvailableDate ? `, wieder verfügbar ab ${kinderbettStatus.nextAvailableDate}` : ""}.`
      : "";

  const priceCalc = nights > 0 ? calculatePrice(nights, extras, pricing, discounts) : null;

  const canSubmit =
    nights > 0 &&
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    !rangeError &&
    !kinderbettError &&
    !submitting;

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!canSubmit || !priceCalc) return;
    setSubmitting(true);
    try {
      await fetch("/api/fewo/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartmentId,
          apartmentName,
          checkIn,
          checkOut,
          nights,
          name,
          email,
          phone,
          persons,
          extras,
          message,
          estimatedTotal: priceCalc.total,
        }),
      });
    } catch {
      // silently continue — mailto still opens
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }

    const extraLines = [
      extras.kinderbett ? "Kinderbett: Ja" : "",
      extras.aufbettung ? "Aufbettung: Ja" : "",
    ].filter(Boolean).join("\n");

    const body = [
      `Ferienwohnung: ${apartmentName} (${apartmentId})`,
      `Anreise: ${checkIn}`,
      `Abreise: ${checkOut}`,
      `Nächte: ${nights}`,
      ``,
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone}`,
      `Personen: ${persons}`,
      extraLines,
      ``,
      `Geschätzter Gesamtpreis: ${priceCalc.total.toFixed(2)} €`,
      priceCalc.discountPercent > 0
        ? `(inkl. ${priceCalc.discountPercent}% Rabatt für ${nights} Nächte)`
        : "",
      ``,
      `Nachricht: ${message || "–"}`,
    ].filter((l) => l !== undefined).join("\n");

    window.location.href = `mailto:trebelcafe@gmx.de?subject=Buchungsanfrage: ${encodeURIComponent(apartmentName)}&body=${encodeURIComponent(body)}`;
  }

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="font-playfair text-xl text-espresso">Anfrage gespeichert</h3>
        <p className="font-dm text-sm text-espresso/60 max-w-xs mx-auto">
          Ihre Anfrage wurde gespeichert und Ihr E-Mail-Programm geöffnet. Wir melden uns schnellstmöglich.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-sand rounded-lg px-3 py-2.5 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors bg-white/60";

  return (
    <div className="space-y-4">
      <h3 className="font-playfair text-xl text-espresso">Buchungsanfrage</h3>

      {/* Range calendar */}
      <div className="booking-cal border border-sand rounded-xl bg-white">
        <style>{`
          .booking-cal .rdp-root {
            --rdp-accent-color: #2C1810;
            --rdp-accent-background-color: rgba(44,24,16,0.08);
            --rdp-today-color: #C4724A;
            --rdp-selected-border: none;
            --rdp-range_start-background: #2C1810;
            --rdp-range_end-background: #2C1810;
            --rdp-range_middle-background: rgba(44,24,16,0.08);
            --rdp-range_middle-color: #2C1810;
            --rdp-day_button-border-radius: 6px;
            margin: 0;
            width: 100%;
            padding: 0 8px;
          }
          .booking-cal .rdp-month { width: 100%; }
          .booking-cal .rdp-month_caption {
            font-family: var(--font-playfair, serif);
            color: #2C1810;
            font-size: 0.95rem;
            padding: 10px 4px 4px;
          }
          .booking-cal .rdp-day { font-family: var(--font-dm-sans, sans-serif); font-size: 12px; }
          .booking-cal .day-booked .rdp-day_button {
            background-color: #C4724A !important;
            color: white !important;
            border: none !important;
            border-radius: 6px;
            cursor: not-allowed;
          }
          .booking-cal .day-booked { opacity: 1 !important; }
          .booking-cal .day-blocked { opacity: 1 !important; position: relative; }
          .booking-cal .day-blocked .rdp-day_button {
            background-color: #f0ebe4 !important;
            color: #9c8880 !important;
            border: none !important;
            border-radius: 6px;
            cursor: not-allowed;
            position: relative;
            overflow: hidden;
          }
          .booking-cal .day-blocked .rdp-day_button::after {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
              135deg,
              transparent,
              transparent 3px,
              rgba(156,136,128,0.35) 3px,
              rgba(156,136,128,0.35) 4px
            );
            border-radius: 6px;
          }
          .booking-cal .rdp-range_start .rdp-day_button,
          .booking-cal .rdp-range_end .rdp-day_button {
            background-color: #2C1810 !important;
            color: #F5EFE6 !important;
            border-radius: 6px !important;
          }
          .booking-cal .rdp-range_middle .rdp-day_button {
            background-color: rgba(44,24,16,0.12) !important;
            color: #2C1810 !important;
            border-radius: 0 !important;
          }
          .booking-cal .rdp-range_start { border-radius: 6px 0 0 6px; }
          .booking-cal .rdp-range_end { border-radius: 0 6px 6px 0; }
        `}</style>
        <DayPicker
          mode="range"
          selected={range.from ? { from: range.from, to: range.to } : undefined}
          onSelect={(r) => setRange({ from: r?.from, to: r?.to })}
          modifiers={{ booked: bookedDateObjs, blocked: blockedDateObjs }}
          modifiersClassNames={{ booked: "day-booked", blocked: "day-blocked" }}
          disabled={(date) => {
            const key = localDateKey(date);
            const blockedSet = new Set(blockedDates);
            const bookedSet = new Set(bookedDates);
            return blockedSet.has(key) || bookedSet.has(key);
          }}
          fromDate={new Date()}
          numberOfMonths={1}
        />
        <div className="flex flex-wrap gap-4 px-4 pb-3 pt-1 border-t border-sand/50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-terracotta" />
            <span className="font-dm text-xs text-espresso/50">Gebucht</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background: "repeating-linear-gradient(135deg, #f0ebe4, #f0ebe4 3px, rgba(156,136,128,0.5) 3px, rgba(156,136,128,0.5) 4px)",
              }}
            />
            <span className="font-dm text-xs text-espresso/50">Gesperrt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-espresso" />
            <span className="font-dm text-xs text-espresso/50">Ausgewählt</span>
          </div>
        </div>
      </div>

      {/* Selected range display */}
      {(range.from || range.to) && (
        <div className="flex items-center gap-2 bg-espresso/5 rounded-lg px-3 py-2">
          <span className="font-dm text-xs text-espresso/50 uppercase tracking-wider">Zeitraum</span>
          <span className="font-dm text-sm text-espresso ml-auto">
            {range.from ? range.from.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–"}
            {" → "}
            {range.to ? range.to.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "?"}
          </span>
          {nights > 0 && (
            <span className="font-dm text-xs text-espresso/40">{nights} Nacht{nights !== 1 ? "e" : ""}</span>
          )}
          <button
            onClick={() => setRange({ from: undefined, to: undefined })}
            className="font-dm text-xs text-espresso/30 hover:text-espresso/60 transition-colors ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {rangeError && (
        <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{rangeError}</p>
      )}

      <div>
        <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">E-Mail *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Telefon *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Personen</label>
        <input
          type="number"
          min={1}
          max={showAufbettung ? 4 : 2}
          value={persons}
          onChange={(e) => setPersons(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      {/* Extras */}
      <div className="space-y-2">
        <p className="font-dm text-xs text-espresso/60 uppercase tracking-wider">Extras (optional)</p>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={extras.kinderbett}
            onChange={(e) => setExtras((prev) => ({ ...prev, kinderbett: e.target.checked }))}
            className="w-4 h-4 accent-terracotta"
          />
          <span className="font-dm text-sm text-espresso group-hover:text-terracotta transition-colors">
            Kinderbett (+{pricing.kinderbettFee} €)
          </span>
        </label>
        {kinderbettError && (
          <p className="font-dm text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 ml-7">
            {kinderbettError}
          </p>
        )}
        {showAufbettung && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={extras.aufbettung}
              onChange={(e) => setExtras((prev) => ({ ...prev, aufbettung: e.target.checked }))}
              className="w-4 h-4 accent-terracotta"
            />
            <span className="font-dm text-sm text-espresso group-hover:text-terracotta transition-colors">
              Aufbettung (+{pricing.aufbettungFee} €)
            </span>
          </label>
        )}
      </div>

      <div>
        <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Nachricht</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-sand rounded-lg px-3 py-2.5 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors resize-none bg-white/60"
        />
      </div>

      {priceCalc && !rangeError && (
        <div className="bg-espresso/5 rounded-xl p-4 space-y-2 border border-sand">
          <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider mb-2">Preisübersicht</p>
          <div className="flex justify-between">
            <span className="font-dm text-sm text-espresso">{nights} Nacht{nights !== 1 ? "e" : ""} × {pricing.perNight} €</span>
            <span className="font-dm text-sm text-espresso">{priceCalc.nightsTotal.toFixed(2)} €</span>
          </div>
          {priceCalc.discountPercent > 0 ? (
            <div className="flex justify-between">
              <span className="font-dm text-sm text-sage">Rabatt ({priceCalc.discountPercent}%)</span>
              <span className="font-dm text-sm text-sage">−{priceCalc.discountAmount.toFixed(2)} €</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="font-dm text-sm text-espresso/40">
                Rabatt
                {nights < 3
                  ? ` (ab 3 Nächten: ${discounts.threeNights}%)`
                  : nights < 7
                  ? ` (ab 7 Nächten: ${discounts.sevenNights}%)`
                  : ""}
              </span>
              <span className="font-dm text-sm text-espresso/40">–</span>
            </div>
          )}
          {priceCalc.extrasTotal > 0 && (
            <div className="flex justify-between">
              <span className="font-dm text-sm text-espresso/60">
                Extras ({[extras.kinderbett && "Kinderbett", extras.aufbettung && "Aufbettung"].filter(Boolean).join(", ")})
              </span>
              <span className="font-dm text-sm text-espresso">{priceCalc.extrasTotal.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-dm text-sm text-espresso/60">Endreinigung</span>
            <span className="font-dm text-sm text-espresso">{pricing.cleaningFee.toFixed(2)} €</span>
          </div>
          <div className="border-t border-sand pt-2 flex justify-between">
            <span className="font-playfair text-base text-espresso font-semibold">Gesamt (ca.)</span>
            <span className="font-playfair text-terracotta text-base font-semibold">{priceCalc.total.toFixed(2)} €</span>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full text-center px-6 py-3 rounded-full font-dm text-sm font-medium transition-all duration-300 ${
          canSubmit
            ? "bg-terracotta text-white hover:bg-[#b3623c] hover:shadow-md cursor-pointer"
            : "bg-sand text-espresso/40 cursor-not-allowed"
        }`}
      >
        {submitting ? "Wird gesendet…" : "Anfrage senden →"}
      </button>
      <p className="font-dm text-xs text-espresso/40 text-center">
        Öffnet Ihr E-Mail-Programm zur Bestätigung. Wir melden uns schnellstmöglich.
      </p>
    </div>
  );
}
