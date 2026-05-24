"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Apartment, ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-utils";
import type { Booking } from "@/lib/bookings-store";

type Props = {
  initialApartments: Apartment[];
  initialGlobalBlockedDates: string[];
};

// ─── Pricing Editor ──────────────────────────────────────────────────────────

function NumInput({
  label,
  value,
  onChange,
  unit = "€",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div>
      <label className="block font-dm text-xs text-espresso/50 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center border border-sand rounded-lg focus-within:border-terracotta transition-colors bg-white">
        <input
          type="number"
          min={0}
          step={0.01}
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="flex-1 px-3 py-2.5 font-dm text-sm text-espresso focus:outline-none bg-transparent rounded-l-lg"
        />
        <span className="px-3 font-dm text-xs text-espresso/30 border-l border-sand">{unit}</span>
      </div>
    </div>
  );
}

function PricingEditor({
  apt,
  onSaved,
}: {
  apt: Apartment;
  onSaved: (u: Apartment) => void;
}) {
  const [pricing, setPricing] = useState<ApartmentPricing>(apt.pricing);
  const [discounts, setDiscounts] = useState<ApartmentDiscounts>(apt.discounts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/fewo/${apt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...apt, pricing, discounts }),
      });
      if (res.ok) {
        onSaved(await res.json());
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      } else {
        const e = await res.json().catch(() => ({}));
        setError(`Fehler: ${(e as { error?: string }).error ?? "Unbekannt"}`);
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-dm text-xs text-espresso/40 uppercase tracking-widest mb-4">Grundpreise</p>
        <div className="space-y-3">
          <NumInput label="Preis pro Nacht" value={pricing.perNight} onChange={(v) => setPricing({ ...pricing, perNight: v })} />
          <NumInput label="Kinderbett (einmalig)" value={pricing.kinderbettFee} onChange={(v) => setPricing({ ...pricing, kinderbettFee: v })} />
          <NumInput label="Aufbettung (einmalig)" value={pricing.aufbettungFee} onChange={(v) => setPricing({ ...pricing, aufbettungFee: v })} />
          <NumInput label="Endreinigung" value={pricing.cleaningFee} onChange={(v) => setPricing({ ...pricing, cleaningFee: v })} />
        </div>
      </div>
      <div>
        <p className="font-dm text-xs text-espresso/40 uppercase tracking-widest mb-4">Rabatte</p>
        <div className="space-y-3">
          <NumInput label="Ab 3 Nächten" value={discounts.threeNights} onChange={(v) => setDiscounts({ ...discounts, threeNights: v })} unit="%" />
          <NumInput label="Ab 7 Nächten" value={discounts.sevenNights} onChange={(v) => setDiscounts({ ...discounts, sevenNights: v })} unit="%" />
        </div>
      </div>
      {error && <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="font-dm text-xs text-sage bg-sage/10 rounded-lg px-3 py-2">✓ Änderungen gespeichert</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2.5 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50"
      >
        {saving ? "Speichern…" : "Preise speichern"}
      </button>
    </div>
  );
}

// ─── Blocked Dates Editor ─────────────────────────────────────────────────────

const CAL_STYLE = `
  .admin-cal .rdp-root {
    --rdp-accent-color: #C4724A;
    --rdp-accent-background-color: rgba(196,114,74,0.15);
    --rdp-today-color: #6B7C5E;
    --rdp-day_button-border-radius: 6px;
    margin: 0;
  }
  .admin-cal .rdp-month_caption { font-family: var(--font-playfair, serif); color: #2C1810; }
  .admin-cal .rdp-day { font-family: var(--font-dm-sans, sans-serif); font-size: 13px; }
  .admin-cal .rdp-selected .rdp-day_button {
    background-color: #C4724A !important;
    color: white !important;
    border: none !important;
    border-radius: 6px;
  }
  .admin-cal .day-global { opacity: 1 !important; }
  .admin-cal .day-global .rdp-day_button {
    background-color: #f0ebe4 !important;
    color: #9c8880 !important;
    border: none !important;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    cursor: default;
  }
  .admin-cal .day-global .rdp-day_button::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      135deg,
      transparent,
      transparent 3px,
      rgba(196,114,74,0.4) 3px,
      rgba(196,114,74,0.4) 4px
    );
    border-radius: 6px;
  }
`;

function BlockedDatesEditor({
  apt,
  globalBlockedDates,
  onSaved,
}: {
  apt: Apartment;
  globalBlockedDates: string[];
  onSaved: (dates: string[], isGlobal: boolean) => void;
}) {
  const [isGlobal, setIsGlobal] = useState(false);
  const [blocked, setBlocked] = useState<Date[]>(
    apt.blockedDates.map((d) => new Date(d + "T00:00:00"))
  );
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);

  const globalDateObjs = isGlobal
    ? []
    : globalBlockedDates.map((d) => new Date(d + "T00:00:00"));
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const source = isGlobal ? globalBlockedDates : apt.blockedDates;
    setBlocked(source.map((d) => new Date(d + "T00:00:00")));
  }, [isGlobal, apt.blockedDates, globalBlockedDates]);

  function addRange() {
    if (!rangeFrom || !rangeTo) return;
    const start = new Date(rangeFrom + "T00:00:00");
    const end = new Date(rangeTo + "T00:00:00");
    if (start > end) return;
    const existing = new Set(blocked.map((d) => d.toISOString().slice(0, 10)));
    const toAdd: Date[] = [];
    const curr = new Date(start);
    while (curr <= end) {
      const key = curr.toISOString().slice(0, 10);
      if (!existing.has(key)) toAdd.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    setBlocked((prev) => [...prev, ...toAdd]);
    setRangeFrom("");
    setRangeTo("");
  }

  async function handleSave(overrideDates?: string[]) {
    setSaving(true);
    setError("");
    setSuccess(false);
    const blockedDates = overrideDates ?? blocked.map((d) => d.toISOString().slice(0, 10));
    try {
      const res = await fetch(`/api/fewo/${apt.id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedDates, global: isGlobal }),
      });
      if (res.ok) {
        if (overrideDates !== undefined) setBlocked([]);
        onSaved(blockedDates, isGlobal);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      } else {
        const e = await res.json().catch(() => ({}));
        setError(`Fehler: ${(e as { error?: string }).error ?? "Unbekannt"}`);
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Scope toggle */}
      <div className="flex gap-1 p-1 bg-sand/40 rounded-xl">
        <button
          onClick={() => setIsGlobal(false)}
          className={`flex-1 py-2 rounded-lg font-dm text-sm transition-colors ${!isGlobal ? "bg-espresso text-cream shadow-sm" : "text-espresso/50 hover:text-espresso"}`}
        >
          Nur {apt.name}
        </button>
        <button
          onClick={() => setIsGlobal(true)}
          className={`flex-1 py-2 rounded-lg font-dm text-sm transition-colors ${isGlobal ? "bg-espresso text-cream shadow-sm" : "text-espresso/50 hover:text-espresso"}`}
        >
          Beide Apartments
        </button>
      </div>

      {/* Range block */}
      <div className="space-y-2">
        <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider">Zeitraum sperren</p>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block font-dm text-xs text-espresso/40 mb-1">Von</label>
            <input
              type="date"
              value={rangeFrom}
              onChange={(e) => setRangeFrom(e.target.value)}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block font-dm text-xs text-espresso/40 mb-1">Bis</label>
            <input
              type="date"
              value={rangeTo}
              min={rangeFrom}
              onChange={(e) => setRangeTo(e.target.value)}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
          <button
            onClick={addRange}
            disabled={!rangeFrom || !rangeTo}
            className="px-4 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider">Tage einzeln auswählen</p>
          {!isGlobal && globalBlockedDates.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{
                  background: "repeating-linear-gradient(135deg, #f0ebe4, #f0ebe4 3px, rgba(196,114,74,0.5) 3px, rgba(196,114,74,0.5) 4px)",
                }}
              />
              <span className="font-dm text-xs text-espresso/40">Beide gesperrt</span>
            </div>
          )}
        </div>
        <style>{CAL_STYLE}</style>
        <div className="admin-cal border border-sand rounded-xl overflow-hidden bg-white">
          <DayPicker
            mode="multiple"
            selected={blocked}
            onSelect={(days: Date[] | undefined) => {
              if (!isGlobal) {
                const globalKeys = new Set(globalBlockedDates);
                setBlocked((days ?? []).filter((d) => !globalKeys.has(d.toISOString().slice(0, 10))));
              } else {
                setBlocked(days ?? []);
              }
            }}
            modifiers={{ global: globalDateObjs }}
            modifiersClassNames={{ global: "day-global" }}
            disabled={(date) =>
              !isGlobal && globalBlockedDates.includes(date.toISOString().slice(0, 10))
            }
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="font-dm text-xs text-espresso/40">
            {blocked.length} {blocked.length === 1 ? "Tag" : "Tage"} gesperrt
            {isGlobal ? " (beide Apartments)" : ` (nur ${apt.name})`}
          </p>
          {!isGlobal && globalBlockedDates.length > 0 && (
            <p className="font-dm text-xs text-terracotta/70">
              + {globalBlockedDates.length} global gesperrt
            </p>
          )}
        </div>
      </div>

      {error && <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="font-dm text-xs text-sage bg-sage/10 rounded-lg px-3 py-2">✓ Gespeichert</p>}

      {clearConfirm ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
          <p className="font-dm text-sm text-red-700">
            {isGlobal
              ? "Alle globalen Sperren löschen? Das entsperrt diese Tage für beide Wohnungen."
              : `Alle Sperren für ${apt.name} löschen?`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setClearConfirm(false)}
              className="flex-1 px-3 py-2 border border-sand font-dm text-sm text-espresso/60 rounded-lg hover:text-espresso transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => { setClearConfirm(false); handleSave([]); }}
              className="flex-1 px-3 py-2 bg-red-500 text-white font-dm text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Ja, alle entsperren
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setClearConfirm(true)}
            className="px-3 py-2.5 border border-sand font-dm text-sm text-espresso/50 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
          >
            {isGlobal ? "Alle globalen entsperren" : `Nur ${apt.name} entsperren`}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-espresso text-cream font-dm text-sm rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Gesperrte Tage speichern"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Bookings View ────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  acting,
  onConfirm,
  onCancel,
}: {
  booking: Booking;
  acting: boolean;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const { status } = booking;

  const statusBadge = {
    pending: { label: "Ausstehend", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    confirmed: { label: "Bestätigt", cls: "bg-green-50 text-green-700 border border-green-200" },
    cancelled: { label: "Abgelehnt", cls: "bg-sand text-espresso/40" },
  }[status];

  const extraLabels: string[] = [];
  if (booking.extras?.kinderbett) extraLabels.push("Kinderbett");
  if (booking.extras?.aufbettung) extraLabels.push("Aufbettung");

  return (
    <div className={`rounded-xl border p-4 transition-all ${status === "cancelled" ? "border-sand bg-sand/20 opacity-50" : "border-sand bg-white shadow-sm"}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-playfair text-base text-espresso truncate">{booking.name}</p>
          <p className="font-dm text-xs text-espresso/50 mt-0.5">
            {booking.checkIn} → {booking.checkOut}
            <span className="text-espresso/30"> · {booking.nights} Nacht{booking.nights !== 1 ? "e" : ""}</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-playfair text-terracotta font-semibold text-sm">{booking.estimatedTotal.toFixed(2)} €</p>
          <span className={`inline-block mt-1 font-dm text-xs px-2 py-0.5 rounded-full ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        </div>
      </div>

      <div className="space-y-1 text-xs font-dm text-espresso/55">
        <p>{booking.email} · {booking.phone}</p>
        <p>
          {booking.persons} {booking.persons === 1 ? "Person" : "Personen"}
          {extraLabels.length > 0 ? ` · ${extraLabels.join(", ")}` : ""}
        </p>
        {booking.message && <p className="italic text-espresso/40 mt-1">„{booking.message}"</p>}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand/60">
        <p className="font-dm text-xs text-espresso/30">
          {new Date(booking.createdAt).toLocaleDateString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
          })}
        </p>

        {status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onCancel(booking.id)}
              disabled={acting}
              className="font-dm text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {acting ? "…" : "Ablehnen"}
            </button>
            <button
              onClick={() => onConfirm(booking.id)}
              disabled={acting}
              className="font-dm text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {acting ? "…" : "Annehmen"}
            </button>
          </div>
        )}

        {status === "confirmed" && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={acting}
            className="font-dm text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 underline underline-offset-2"
          >
            {acting ? "…" : "Stornieren"}
          </button>
        )}
      </div>
    </div>
  );
}

function BookingsView({ apartmentId }: { apartmentId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [acting, setActing] = useState<string | null>(null);
  const [actError, setActError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/fewo/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings ?? []);
      } else {
        const e = await res.json().catch(() => ({}));
        setLoadError(`Fehler ${res.status}: ${(e as { error?: string }).error ?? "Unbekannt"}`);
      }
    } catch {
      setLoadError("Netzwerkfehler beim Laden der Anfragen.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    setActing(id);
    setActError("");
    try {
      const res = await fetch(`/api/fewo/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      } else {
        const e = await res.json().catch(() => ({}));
        setActError(`Fehler: ${(e as { error?: string }).error ?? "Unbekannt"}`);
      }
    } catch {
      setActError("Netzwerkfehler");
    } finally {
      setActing(null);
    }
  }

  if (loading) return <div className="py-16 text-center"><div className="inline-block w-5 h-5 border-2 border-sand border-t-terracotta rounded-full animate-spin" /></div>;

  if (loadError) return (
    <div className="py-10 text-center space-y-3">
      <p className="font-dm text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{loadError}</p>
      <button onClick={load} className="font-dm text-xs text-terracotta hover:text-[#b3623c] transition-colors">↻ Erneut versuchen</button>
    </div>
  );

  const aptBookings = bookings.filter((b) => b.apartmentId === apartmentId);
  const pending = aptBookings.filter((b) => b.status === "pending");
  const confirmed = aptBookings.filter((b) => b.status === "confirmed");
  const cancelled = aptBookings.filter((b) => b.status === "cancelled");

  return (
    <div className="space-y-4">
      {actError && (
        <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{actError}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {pending.length > 0 && (
            <span className="inline-flex items-center gap-1.5 font-dm text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              {pending.length} ausstehend
            </span>
          )}
          {confirmed.length > 0 && (
            <span className="inline-flex items-center gap-1.5 font-dm text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {confirmed.length} bestätigt
            </span>
          )}
        </div>
        <button onClick={load} className="font-dm text-xs text-terracotta hover:text-[#b3623c] transition-colors">
          ↻ Aktualisieren
        </button>
      </div>

      {aptBookings.length === 0 && (
        <div className="py-14 text-center">
          <p className="font-playfair text-2xl text-espresso/20 mb-1">0</p>
          <p className="font-dm text-sm text-espresso/30">Noch keine Anfragen</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-3">
          {pending.map((b) => (
            <BookingCard key={b.id} booking={b} acting={acting === b.id}
              onConfirm={(id) => updateStatus(id, "confirmed")}
              onCancel={(id) => updateStatus(id, "cancelled")} />
          ))}
        </div>
      )}

      {confirmed.length > 0 && (
        <div className="space-y-3 pt-1">
          <p className="font-dm text-xs text-espresso/25 uppercase tracking-widest">Bestätigt</p>
          {confirmed.map((b) => (
            <BookingCard key={b.id} booking={b} acting={acting === b.id}
              onConfirm={(id) => updateStatus(id, "confirmed")}
              onCancel={(id) => updateStatus(id, "cancelled")} />
          ))}
        </div>
      )}

      {cancelled.length > 0 && (
        <div className="space-y-3 pt-1">
          <p className="font-dm text-xs text-espresso/25 uppercase tracking-widest">Abgelehnt / Storniert</p>
          {cancelled.map((b) => (
            <BookingCard key={b.id} booking={b} acting={acting === b.id}
              onConfirm={(id) => updateStatus(id, "confirmed")}
              onCancel={(id) => updateStatus(id, "cancelled")} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

type Section = "anfragen" | "gesperrt" | "preise";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "anfragen", label: "Anfragen", icon: "📩" },
  { key: "gesperrt", label: "Gesperrte Tage", icon: "🔒" },
  { key: "preise", label: "Preise", icon: "💶" },
];

export default function FewoPanel({ initialApartments, initialGlobalBlockedDates }: Props) {
  const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
  const [globalBlockedDates, setGlobalBlockedDates] = useState<string[]>(initialGlobalBlockedDates);
  const [activeApt, setActiveApt] = useState<string>(initialApartments[0]?.id ?? "");
  const [activeSection, setActiveSection] = useState<Section>("anfragen");

  const apt = apartments.find((a) => a.id === activeApt);

  function updateApartment(updated: Apartment) {
    setApartments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  function handleBlockedSaved(dates: string[], isGlobal: boolean) {
    if (isGlobal) {
      setGlobalBlockedDates(dates);
    } else {
      setApartments((prev) =>
        prev.map((a) => (a.id === activeApt ? { ...a, blockedDates: dates } : a))
      );
    }
  }

  if (!apt) return null;

  return (
    <div className="rounded-2xl border border-sand overflow-hidden bg-white">
      {/* Top bar */}
      <div className="border-b border-sand bg-cream/60">
        {/* Apartment selector */}
        <div className="flex gap-1 p-3 border-b border-sand/60">
          {apartments.map((a) => (
            <button
              key={a.id}
              onClick={() => setActiveApt(a.id)}
              className={`px-3 py-1.5 rounded-lg font-dm text-sm transition-colors ${
                activeApt === a.id ? "bg-espresso text-cream" : "text-espresso/60 hover:bg-sand/60 hover:text-espresso"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
        {/* Section tabs */}
        <div className="flex gap-1 p-3">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-dm text-sm transition-colors ${
                activeSection === s.key
                  ? "bg-terracotta/10 text-terracotta font-medium"
                  : "text-espresso/55 hover:bg-sand/50 hover:text-espresso"
              }`}
            >
              <span className="text-base leading-none">{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 overflow-y-auto">
        <div className="mb-5">
          <h3 className="font-playfair text-lg text-espresso">
            {SECTIONS.find((s) => s.key === activeSection)?.label}
          </h3>
          <p className="font-dm text-xs text-espresso/40 mt-0.5">{apt.name}</p>
        </div>

        {activeSection === "anfragen" && <BookingsView key={apt.id} apartmentId={apt.id} />}
        {activeSection === "gesperrt" && (
          <BlockedDatesEditor
            key={apt.id + "-blocked"}
            apt={apt}
            globalBlockedDates={globalBlockedDates}
            onSaved={handleBlockedSaved}
          />
        )}
        {activeSection === "preise" && (
          <PricingEditor key={apt.id + "-pricing"} apt={apt} onSaved={updateApartment} />
        )}
      </div>
    </div>
  );
}
