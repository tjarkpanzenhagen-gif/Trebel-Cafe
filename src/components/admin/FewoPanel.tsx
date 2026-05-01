"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Apartment, ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-utils";
import type { Booking } from "@/lib/bookings-store";

type Props = {
  initialApartments: Apartment[];
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
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
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
        <p className="font-dm text-xs text-espresso/40 uppercase tracking-widest mb-4">
          Grundpreise
        </p>
        <div className="space-y-3">
          <NumInput
            label="Preis pro Nacht"
            value={pricing.perNight}
            onChange={(v) => setPricing({ ...pricing, perNight: v })}
          />
          <NumInput
            label="Aufbettung pro Person"
            value={pricing.extraBed}
            onChange={(v) => setPricing({ ...pricing, extraBed: v })}
          />
          <NumInput
            label="Endreinigung"
            value={pricing.cleaningFee}
            onChange={(v) => setPricing({ ...pricing, cleaningFee: v })}
          />
        </div>
      </div>
      <div>
        <p className="font-dm text-xs text-espresso/40 uppercase tracking-widest mb-4">Rabatte</p>
        <div className="space-y-3">
          <NumInput
            label="Ab 3 Nächten"
            value={discounts.threeNights}
            onChange={(v) => setDiscounts({ ...discounts, threeNights: v })}
            unit="%"
          />
          <NumInput
            label="Ab 7 Nächten"
            value={discounts.sevenNights}
            onChange={(v) => setDiscounts({ ...discounts, sevenNights: v })}
            unit="%"
          />
        </div>
      </div>
      {error && <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {success && (
        <p className="font-dm text-xs text-sage bg-sage/10 rounded-lg px-3 py-2">
          ✓ Änderungen gespeichert
        </p>
      )}
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

// ─── Availability Editor ──────────────────────────────────────────────────────

function AvailabilityEditor({
  apt,
  onSaved,
}: {
  apt: Apartment;
  onSaved: (dates: string[]) => void;
}) {
  const [selected, setSelected] = useState<Date[]>(
    apt.blockedDates.map((d) => new Date(d + "T00:00:00"))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);
    const blockedDates = selected.map((d) => d.toISOString().slice(0, 10));
    try {
      const res = await fetch(`/api/fewo/${apt.id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedDates }),
      });
      if (res.ok) {
        onSaved(blockedDates);
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
    <div className="space-y-4">
      <p className="font-dm text-xs text-espresso/50">
        Tage anklicken zum Blockieren oder Freigeben
      </p>
      <style>{`
        .admin-cal .rdp-root {
          --rdp-accent-color: #2C1810;
          --rdp-accent-background-color: rgba(44,24,16,0.1);
          --rdp-today-color: #C4724A;
          --rdp-selected-border: 2px solid transparent;
          --rdp-day_button-border-radius: 6px;
          margin: 0;
        }
        .admin-cal .rdp-month_caption { font-family: var(--font-playfair, serif); color: #2C1810; }
        .admin-cal .rdp-day { font-family: var(--font-dm-sans, sans-serif); font-size: 13px; }
        .admin-cal .rdp-selected .rdp-day_button {
          background-color: #2C1810 !important;
          color: rgba(255,255,255,0.85) !important;
          border: none !important;
          border-radius: 6px;
        }
      `}</style>
      <div className="admin-cal border border-sand rounded-xl overflow-hidden bg-white">
        <DayPicker
          mode="multiple"
          selected={selected}
          onSelect={(days: Date[] | undefined) => setSelected(days ?? [])}
          fromDate={new Date()}
        />
      </div>
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#6B7C5E]" />
          <span className="font-dm text-xs text-espresso/50">Frei</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-espresso opacity-70" />
          <span className="font-dm text-xs text-espresso/50">Blockiert</span>
        </div>
      </div>
      {error && <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {success && (
        <p className="font-dm text-xs text-sage bg-sage/10 rounded-lg px-3 py-2">
          ✓ Verfügbarkeit gespeichert — Seite wird aktualisiert
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2.5 bg-espresso text-cream font-dm text-sm rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
      >
        {saving ? "Speichern…" : "Verfügbarkeit speichern"}
      </button>
    </div>
  );
}

// ─── Bookings View ────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  cancelling,
  onCancel,
}: {
  booking: Booking;
  cancelling: boolean;
  onCancel: (id: string) => void;
}) {
  const isCancelled = booking.status === "cancelled";
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isCancelled ? "border-sand bg-sand/20 opacity-50" : "border-sand bg-white shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-playfair text-base text-espresso truncate">{booking.name}</p>
          <p className="font-dm text-xs text-espresso/50 mt-0.5">
            {booking.checkIn} → {booking.checkOut}
            <span className="text-espresso/30"> · {booking.nights} Nacht{booking.nights !== 1 ? "e" : ""}</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-playfair text-terracotta font-semibold text-sm">
            {booking.estimatedTotal.toFixed(2)} €
          </p>
          <span
            className={`inline-block mt-1 font-dm text-xs px-2 py-0.5 rounded-full ${
              isCancelled
                ? "bg-sand text-espresso/40"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {isCancelled ? "Storniert" : "Ausstehend"}
          </span>
        </div>
      </div>
      <div className="space-y-1 text-xs font-dm text-espresso/55">
        <p>{booking.email} · {booking.phone}</p>
        <p>
          {booking.persons} {booking.persons === 1 ? "Person" : "Personen"}
          {booking.extraBeds > 0 ? ` · ${booking.extraBeds}× Aufbettung` : ""}
        </p>
        {booking.message && (
          <p className="italic text-espresso/40 mt-1">„{booking.message}"</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand/60">
        <p className="font-dm text-xs text-espresso/30">
          {new Date(booking.createdAt).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {!isCancelled && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={cancelling}
            className="font-dm text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 underline underline-offset-2"
          >
            {cancelling ? "…" : "Stornieren"}
          </button>
        )}
      </div>
    </div>
  );
}

function BookingsView({ apartmentId }: { apartmentId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fewo/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const aptBookings = bookings.filter((b) => b.apartmentId === apartmentId);
  const pending = aptBookings.filter((b) => b.status === "pending");
  const cancelled = aptBookings.filter((b) => b.status === "cancelled");

  async function handleCancel(id: string) {
    setCancelling(id);
    try {
      const res = await fetch(`/api/fewo/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
        );
      }
    } finally {
      setCancelling(null);
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-5 h-5 border-2 border-sand border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {pending.length > 0 && (
            <span className="inline-flex items-center gap-1.5 font-dm text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {pending.length} ausstehend
            </span>
          )}
          {cancelled.length > 0 && (
            <span className="font-dm text-xs text-espresso/30">
              {cancelled.length} storniert
            </span>
          )}
        </div>
        <button
          onClick={load}
          className="font-dm text-xs text-terracotta hover:text-[#b3623c] transition-colors"
        >
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
            <BookingCard
              key={b.id}
              booking={b}
              cancelling={cancelling === b.id}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {cancelled.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="font-dm text-xs text-espresso/25 uppercase tracking-widest">Storniert</p>
          {cancelled.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              cancelling={cancelling === b.id}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

type Section = "anfragen" | "verfuegbarkeit" | "preise";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "anfragen", label: "Anfragen", icon: "📩" },
  { key: "verfuegbarkeit", label: "Verfügbarkeit", icon: "📅" },
  { key: "preise", label: "Preise", icon: "💶" },
];

export default function FewoPanel({ initialApartments }: Props) {
  const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
  const [activeApt, setActiveApt] = useState<string>(initialApartments[0]?.id ?? "");
  const [activeSection, setActiveSection] = useState<Section>("anfragen");

  const apt = apartments.find((a) => a.id === activeApt);

  function updateApartment(updated: Apartment) {
    setApartments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  function updateAvailability(id: string, blockedDates: string[]) {
    setApartments((prev) => prev.map((a) => (a.id === id ? { ...a, blockedDates } : a)));
  }

  if (!apt) return null;

  return (
    <div className="grid grid-cols-[220px_1fr] gap-0 min-h-[520px] rounded-2xl border border-sand overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="border-r border-sand bg-cream/60 flex flex-col">
        {/* Apartment selector */}
        <div className="p-4 border-b border-sand">
          <p className="font-dm text-xs text-espresso/40 uppercase tracking-widest mb-3">
            Wohnung
          </p>
          <div className="space-y-1">
            {apartments.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveApt(a.id)}
                className={`w-full text-left px-3 py-2 rounded-lg font-dm text-sm transition-colors ${
                  activeApt === a.id
                    ? "bg-espresso text-cream"
                    : "text-espresso/60 hover:bg-sand/60 hover:text-espresso"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section nav */}
        <nav className="p-4 flex-1">
          <p className="font-dm text-xs text-espresso/40 uppercase tracking-widest mb-3">
            Bereich
          </p>
          <div className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full text-left px-3 py-2 rounded-lg font-dm text-sm transition-colors flex items-center gap-2.5 ${
                  activeSection === s.key
                    ? "bg-terracotta/10 text-terracotta font-medium"
                    : "text-espresso/55 hover:bg-sand/50 hover:text-espresso"
                }`}
              >
                <span className="text-base leading-none">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div className="p-6 overflow-y-auto">
        <div className="mb-5">
          <h3 className="font-playfair text-lg text-espresso">
            {SECTIONS.find((s) => s.key === activeSection)?.label}
          </h3>
          <p className="font-dm text-xs text-espresso/40 mt-0.5">{apt.name}</p>
        </div>

        {activeSection === "anfragen" && (
          <BookingsView key={apt.id} apartmentId={apt.id} />
        )}
        {activeSection === "verfuegbarkeit" && (
          <AvailabilityEditor
            key={apt.id + "-avail"}
            apt={apt}
            onSaved={(dates) => updateAvailability(apt.id, dates)}
          />
        )}
        {activeSection === "preise" && (
          <PricingEditor key={apt.id + "-pricing"} apt={apt} onSaved={updateApartment} />
        )}
      </div>
    </div>
  );
}
