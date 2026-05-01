"use client";

import { useState, useEffect } from "react";
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

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function hasUnavailableInRange(
  checkIn: string,
  checkOut: string,
  blockedDates: string[],
  bookedDates: string[]
): boolean {
  if (!checkIn || !checkOut) return false;
  const unavailable = new Set([...blockedDates, ...bookedDates]);
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    if (unavailable.has(d.toISOString().slice(0, 10))) return true;
  }
  return false;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingForm({
  apartmentName,
  apartmentId,
  pricing,
  discounts,
  blockedDates,
  bookedDates,
}: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [persons, setPersons] = useState(1);
  const [extraBeds, setExtraBeds] = useState(0);
  const [message, setMessage] = useState("");
  const [rangeError, setRangeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nights = getNights(checkIn, checkOut);

  useEffect(() => {
    if (checkIn && checkOut && hasUnavailableInRange(checkIn, checkOut, blockedDates, bookedDates)) {
      setRangeError(
        "Der gewählte Zeitraum enthält bereits belegte Tage. Bitte wählen Sie einen anderen Zeitraum."
      );
    } else {
      setRangeError("");
    }
  }, [checkIn, checkOut, blockedDates, bookedDates]);

  const priceCalc = nights > 0 ? calculatePrice(nights, extraBeds, pricing, discounts) : null;

  const canSubmit =
    nights > 0 && name.trim() && email.trim() && phone.trim() && !rangeError && !submitting;

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
          extraBeds,
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
      `Aufbettung: ${extraBeds}`,
      ``,
      `Geschätzter Gesamtpreis: ${priceCalc.total.toFixed(2)} €`,
      priceCalc.discountPercent > 0
        ? `(inkl. ${priceCalc.discountPercent}% Rabatt für ${nights} Nächte)`
        : "",
      ``,
      `Nachricht: ${message || "–"}`,
    ].join("\n");

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Anreise *</label>
          <input type="date" min={todayString()} value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Abreise *</label>
          <input type="date" min={checkIn || todayString()} value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)} className={inputClass} />
        </div>
      </div>

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Personen</label>
          <input type="number" min={1} max={10} value={persons}
            onChange={(e) => setPersons(Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Aufbettung</label>
          <input type="number" min={0} max={5} value={extraBeds}
            onChange={(e) => setExtraBeds(Number(e.target.value))} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block font-dm text-xs text-espresso/60 mb-1.5 uppercase tracking-wider">Nachricht</label>
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-sand rounded-lg px-3 py-2.5 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors resize-none bg-white/60" />
      </div>

      {priceCalc && !rangeError && (
        <div className="bg-espresso/5 rounded-xl p-4 space-y-2 border border-sand">
          <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider mb-2">Preisübersicht</p>
          <div className="flex justify-between">
            <span className="font-dm text-sm text-espresso">{nights} Nacht{nights !== 1 ? "e" : ""} × {pricing.perNight} €</span>
            <span className="font-dm text-sm text-espresso">{priceCalc.nightsTotal.toFixed(2)} €</span>
          </div>
          {priceCalc.discountPercent > 0 && (
            <div className="flex justify-between">
              <span className="font-dm text-sm text-sage">Rabatt ({priceCalc.discountPercent}%)</span>
              <span className="font-dm text-sm text-sage">−{priceCalc.discountAmount.toFixed(2)} €</span>
            </div>
          )}
          {extraBeds > 0 && (
            <div className="flex justify-between">
              <span className="font-dm text-sm text-espresso/60">Aufbettung ({extraBeds}×)</span>
              <span className="font-dm text-sm text-espresso">{priceCalc.extraBedTotal.toFixed(2)} €</span>
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
