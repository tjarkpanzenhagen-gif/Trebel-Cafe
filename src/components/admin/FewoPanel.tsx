"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Apartment, ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-utils";
import type { Booking } from "@/lib/bookings-store";

type Props = {
  initialApartments: Apartment[];
};

function PricingEditor({ apt, onSaved }: { apt: Apartment; onSaved: (u: Apartment) => void }) {
  const [pricing, setPricing] = useState<ApartmentPricing>(apt.pricing);
  const [discounts, setDiscounts] = useState<ApartmentDiscounts>(apt.discounts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch(`/api/fewo/${apt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...apt, pricing, discounts }),
      });
      if (res.ok) { onSaved(await res.json()); setSuccess(true); setTimeout(() => setSuccess(false), 2000); }
      else { const e = await res.json().catch(() => ({})); setError(`Fehler: ${(e as {error?:string}).error ?? "Unbekannt"}`); }
    } catch { setError("Netzwerkfehler"); } finally { setSaving(false); }
  }

  function NumInput({ label, value, onChange, unit = "€" }: { label: string; value: number; onChange: (v: number) => void; unit?: string }) {
    return (
      <div>
        <label className="block font-dm text-xs text-espresso/60 mb-1">{label}</label>
        <div className="flex items-center border border-sand rounded-lg focus-within:border-terracotta transition-colors bg-white">
          <input type="number" min={0} step={0.01} value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 px-3 py-2 font-dm text-sm text-espresso focus:outline-none bg-transparent rounded-l-lg" />
          <span className="px-3 font-dm text-xs text-espresso/40">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-dm text-xs text-espresso/40 uppercase tracking-wider">Grundpreise</p>
      <NumInput label="Preis pro Nacht" value={pricing.perNight} onChange={(v) => setPricing({ ...pricing, perNight: v })} />
      <NumInput label="Aufbettung pro Person" value={pricing.extraBed} onChange={(v) => setPricing({ ...pricing, extraBed: v })} />
      <NumInput label="Endreinigung" value={pricing.cleaningFee} onChange={(v) => setPricing({ ...pricing, cleaningFee: v })} />
      <p className="font-dm text-xs text-espresso/40 uppercase tracking-wider pt-2">Rabatte</p>
      <NumInput label="Ab 3 Nächten" value={discounts.threeNights} onChange={(v) => setDiscounts({ ...discounts, threeNights: v })} unit="%" />
      <NumInput label="Ab 7 Nächten" value={discounts.sevenNights} onChange={(v) => setDiscounts({ ...discounts, sevenNights: v })} unit="%" />
      {error && <p className="font-dm text-xs text-red-600">{error}</p>}
      {success && <p className="font-dm text-xs text-sage">✓ Gespeichert</p>}
      <button onClick={handleSave} disabled={saving}
        className="w-full px-4 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50">
        {saving ? "Speichern…" : "Änderungen speichern"}
      </button>
    </div>
  );
}

function AvailabilityEditor({ apt, onSaved }: { apt: Apartment; onSaved: (dates: string[]) => void }) {
  const [selected, setSelected] = useState<Date[]>(apt.blockedDates.map((d) => new Date(d + "T00:00:00")));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setSaving(true); setError(""); setSuccess(false);
    const blockedDates = selected.map((d) => d.toISOString().slice(0, 10));
    try {
      const res = await fetch(`/api/fewo/${apt.id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedDates }),
      });
      if (res.ok) { onSaved(blockedDates); setSuccess(true); setTimeout(() => setSuccess(false), 2000); }
      else { const e = await res.json().catch(() => ({})); setError(`Fehler: ${(e as {error?:string}).error ?? "Unbekannt"}`); }
    } catch { setError("Netzwerkfehler"); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-3">
      <p className="font-dm text-xs text-espresso/60">Tage anklicken zum Manuell-Blockieren/Freigeben</p>
      <style>{`
        .admin-fewo-cal .rdp { --rdp-accent-color: #2C1810; margin: 0; }
        .admin-fewo-cal .rdp-day_selected { background-color: #2C1810 !important; color: white !important; border-radius: 4px; opacity: 0.7; }
        .admin-fewo-cal .rdp-day { font-family: sans-serif; font-size: 12px; }
      `}</style>
      <div className="admin-fewo-cal border border-sand rounded-xl p-3 bg-white overflow-x-auto">
        <DayPicker mode="multiple" selected={selected}
          onSelect={(days: Date[] | undefined) => setSelected(days ?? [])} fromDate={new Date()} />
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#6B7C5E]" /><span className="font-dm text-xs text-espresso/60">Frei</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-espresso opacity-70" /><span className="font-dm text-xs text-espresso/60">Manuell blockiert</span></div>
      </div>
      {error && <p className="font-dm text-xs text-red-600">{error}</p>}
      {success && <p className="font-dm text-xs text-sage">✓ Gespeichert</p>}
      <button onClick={handleSave} disabled={saving}
        className="w-full px-4 py-2 bg-espresso text-cream font-dm text-sm rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50">
        {saving ? "Speichern…" : "Verfügbarkeit speichern"}
      </button>
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
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

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
        setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b));
      }
    } finally { setCancelling(null); }
  }

  if (loading) return <p className="font-dm text-sm text-espresso/40 py-6 text-center">Lädt…</p>;

  function BookingCard({ booking }: { booking: Booking }) {
    const isCancelled = booking.status === "cancelled";
    return (
      <div className={`border rounded-xl p-4 space-y-2 ${isCancelled ? "border-sand bg-sand/20 opacity-60" : "border-sand bg-white"}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-playfair text-base text-espresso">{booking.name}</p>
            <p className="font-dm text-xs text-espresso/50 mt-0.5">
              {booking.checkIn} → {booking.checkOut} · {booking.nights} Nacht{booking.nights !== 1 ? "e" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-playfair text-terracotta font-semibold text-sm">{booking.estimatedTotal.toFixed(2)} €</p>
            <span className={`inline-block font-dm text-xs px-2 py-0.5 rounded-full mt-1 ${isCancelled ? "bg-sand text-espresso/50" : "bg-sage/20 text-sage"}`}>
              {isCancelled ? "Storniert" : "Ausstehend"}
            </span>
          </div>
        </div>
        <div className="font-dm text-xs text-espresso/60 space-y-0.5">
          <p>{booking.email} · {booking.phone}</p>
          <p>{booking.persons} {booking.persons === 1 ? "Person" : "Personen"}{booking.extraBeds > 0 ? ` · ${booking.extraBeds} Aufbettung` : ""}</p>
          {booking.message && <p className="italic">„{booking.message}"</p>}
        </div>
        <p className="font-dm text-xs text-espresso/30">
          Eingegangen: {new Date(booking.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
        {!isCancelled && (
          <button
            onClick={() => handleCancel(booking.id)}
            disabled={cancelling === booking.id}
            className="w-full mt-1 px-3 py-1.5 border border-red-200 text-red-500 font-dm text-xs rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {cancelling === booking.id ? "Wird storniert…" : "Stornieren"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider">
          {pending.length} ausstehend · {cancelled.length} storniert
        </p>
        <button onClick={load} className="font-dm text-xs text-terracotta hover:underline">Aktualisieren</button>
      </div>

      {pending.length === 0 && cancelled.length === 0 && (
        <p className="font-dm text-sm text-espresso/40 text-center py-8">Noch keine Anfragen.</p>
      )}

      {pending.length > 0 && (
        <div className="space-y-3">
          {pending.map((b) => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}

      {cancelled.length > 0 && (
        <div className="space-y-3">
          <p className="font-dm text-xs text-espresso/30 uppercase tracking-wider pt-2">Storniert</p>
          {cancelled.map((b) => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  );
}

export default function FewoPanel({ initialApartments }: Props) {
  const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
  const [activeApt, setActiveApt] = useState<string>(initialApartments[0]?.id ?? "");
  const [activeSection, setActiveSection] = useState<"verfuegbarkeit" | "preise" | "anfragen">("anfragen");

  const apt = apartments.find((a) => a.id === activeApt);

  function updateApartment(updated: Apartment) {
    setApartments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  function updateAvailability(id: string, blockedDates: string[]) {
    setApartments((prev) => prev.map((a) => (a.id === id ? { ...a, blockedDates } : a)));
  }

  if (!apt) return null;

  return (
    <div>
      {/* Apartment sub-tabs */}
      <div className="flex gap-1 border-b border-sand mb-6">
        {apartments.map((a) => (
          <button key={a.id} onClick={() => setActiveApt(a.id)}
            className={`font-dm text-sm px-4 py-2 border-b-2 transition-colors -mb-px ${activeApt === a.id ? "border-terracotta text-terracotta" : "border-transparent text-espresso/50 hover:text-espresso"}`}>
            {a.name}
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-6">
        {([
          { key: "anfragen", label: "📩 Anfragen" },
          { key: "verfuegbarkeit", label: "📅 Verfügbarkeit" },
          { key: "preise", label: "💶 Preise & Rabatte" },
        ] as const).map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`font-dm text-xs px-4 py-2 rounded-full border transition-colors ${activeSection === s.key ? "border-terracotta bg-terracotta/10 text-terracotta" : "border-sand text-espresso/50 hover:border-espresso/30"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "anfragen" && <BookingsView key={apt.id} apartmentId={apt.id} />}
      {activeSection === "verfuegbarkeit" && (
        <AvailabilityEditor key={apt.id + "-avail"} apt={apt} onSaved={(dates) => updateAvailability(apt.id, dates)} />
      )}
      {activeSection === "preise" && (
        <PricingEditor key={apt.id + "-pricing"} apt={apt} onSaved={updateApartment} />
      )}
    </div>
  );
}
