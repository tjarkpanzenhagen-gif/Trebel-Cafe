"use client";

import { useState } from "react";
import { getClosedDayReason } from "@/lib/dates";

const TIMES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00",
];

export default function ReservierungForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [persons, setPersons] = useState("2 Personen");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const closedReason = date ? getClosedDayReason(date) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (closedReason) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reservierung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, date, time, persons, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unbekannter Fehler");
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Anfrage fehlgeschlagen");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border border-sand rounded-xl px-4 py-3 font-dm text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors";

  if (status === "success") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center mx-auto">
          <span className="text-2xl text-sage">✓</span>
        </div>
        <h3 className="font-playfair text-2xl text-espresso">Anfrage gesendet</h3>
        <p className="font-dm text-sm text-espresso/60 max-w-xs mx-auto">
          Wir haben Ihre Reservierungsanfrage erhalten und melden uns schnellstmöglich zur Bestätigung.
        </p>
        <button
          onClick={() => { setStatus("idle"); setName(""); setContact(""); setDate(""); setMessage(""); }}
          className="font-dm text-sm text-terracotta hover:underline mt-2"
        >
          Neue Anfrage
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-dm text-sm text-espresso/70 mb-2">Euer Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Vorname Nachname"
          maxLength={100}
        />
      </div>
      <div>
        <label className="block font-dm text-sm text-espresso/70 mb-2">Telefon oder E-Mail *</label>
        <input
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={inputClass}
          placeholder="Wie können wir euch erreichen?"
          maxLength={100}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-2">Datum *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
          {closedReason && (
            <p className="font-dm text-xs text-red-500 mt-1.5">{closedReason}</p>
          )}
        </div>
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-2">Uhrzeit *</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className={inputClass}>
            {TIMES.map((t) => (
              <option key={t} value={t}>{t} Uhr</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block font-dm text-sm text-espresso/70 mb-2">Personenzahl *</label>
        <select value={persons} onChange={(e) => setPersons(e.target.value)} className={inputClass}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n}>{n} {n === 1 ? "Person" : "Personen"}</option>
          ))}
          <option>Mehr als 8 (bitte Nachricht hinterlassen)</option>
        </select>
      </div>
      <div>
        <label className="block font-dm text-sm text-espresso/70 mb-2">Nachricht (optional)</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors resize-none"
          placeholder="Besondere Anlässe, Allergien, Wünsche..."
          maxLength={500}
        />
      </div>

      {status === "error" && (
        <p className="font-dm text-sm text-red-500 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || Boolean(closedReason)}
        className="w-full bg-terracotta text-white py-4 rounded-xl font-dm font-medium hover:bg-[#b3623c] transition-colors duration-300 disabled:opacity-60"
      >
        {status === "loading" ? "Wird gesendet…" : "Anfrage senden"}
      </button>
    </form>
  );
}
