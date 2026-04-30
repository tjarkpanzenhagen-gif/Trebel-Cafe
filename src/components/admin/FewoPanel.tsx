"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Apartment, ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-store";

type Props = {
  initialApartments: Apartment[];
};

function PricingEditor({
  apt,
  onSaved,
}: {
  apt: Apartment;
  onSaved: (updated: Apartment) => void;
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
        const updated: Apartment = await res.json();
        onSaved(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(`Fehler: ${(err as { error?: string }).error ?? "Unbekannt"}`);
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "flex-1 px-3 py-2 font-dm text-sm text-espresso focus:outline-none bg-transparent rounded-l-lg";

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
        <label className="block font-dm text-xs text-espresso/60 mb-1">{label}</label>
        <div className="flex items-center border border-sand rounded-lg focus-within:border-terracotta transition-colors bg-white">
          <input
            type="number"
            min={0}
            step={0.01}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={inputClass}
          />
          <span className="px-3 font-dm text-xs text-espresso/40">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-dm text-xs text-espresso/40 uppercase tracking-wider">Grundpreise</p>
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

      <p className="font-dm text-xs text-espresso/40 uppercase tracking-wider pt-2">Rabatte</p>
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

      {error && <p className="font-dm text-xs text-red-600">{error}</p>}
      {success && <p className="font-dm text-xs text-sage">✓ Gespeichert</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50"
      >
        {saving ? "Speichern…" : "Änderungen speichern"}
      </button>
    </div>
  );
}

function AvailabilityEditor({
  apt,
  onSaved,
}: {
  apt: Apartment;
  onSaved: (blockedDates: string[]) => void;
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
        setTimeout(() => setSuccess(false), 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(`Fehler: ${(err as { error?: string }).error ?? "Unbekannt"}`);
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="font-dm text-xs text-espresso/60">
        Tage anklicken zum Belegen/Freigeben — Terracotta = belegt
      </p>
      <style>{`
        .admin-fewo-cal .rdp { --rdp-accent-color: #C4724A; margin: 0; }
        .admin-fewo-cal .rdp-day_selected {
          background-color: #C4724A !important;
          color: white !important;
          border-radius: 4px;
        }
        .admin-fewo-cal .rdp-day { font-family: sans-serif; font-size: 12px; }
      `}</style>
      <div className="admin-fewo-cal border border-sand rounded-xl p-3 bg-white overflow-x-auto">
        <DayPicker
          mode="multiple"
          selected={selected}
          onSelect={(days) => setSelected(days ?? [])}
          fromDate={new Date()}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#6B7C5E]" />
          <span className="font-dm text-xs text-espresso/60">Frei</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-terracotta" />
          <span className="font-dm text-xs text-espresso/60">Belegt</span>
        </div>
      </div>

      {error && <p className="font-dm text-xs text-red-600">{error}</p>}
      {success && <p className="font-dm text-xs text-sage">✓ Verfügbarkeit gespeichert</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2 bg-espresso text-cream font-dm text-sm rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
      >
        {saving ? "Speichern…" : "Verfügbarkeit speichern"}
      </button>
    </div>
  );
}

export default function FewoPanel({ initialApartments }: Props) {
  const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
  const [activeApt, setActiveApt] = useState<string>(initialApartments[0]?.id ?? "");

  const apt = apartments.find((a) => a.id === activeApt);

  function updateApartment(updated: Apartment) {
    setApartments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  function updateAvailability(id: string, blockedDates: string[]) {
    setApartments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, blockedDates } : a))
    );
  }

  if (!apt) return null;

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-sand mb-6">
        {apartments.map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveApt(a.id)}
            className={`font-dm text-sm px-4 py-2 border-b-2 transition-colors -mb-px ${
              activeApt === a.id
                ? "border-terracotta text-terracotta"
                : "border-transparent text-espresso/50 hover:text-espresso"
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-playfair text-lg text-espresso mb-4">Verfügbarkeit verwalten</h3>
          <AvailabilityEditor
            key={apt.id + "-avail"}
            apt={apt}
            onSaved={(dates) => updateAvailability(apt.id, dates)}
          />
        </div>
        <div>
          <h3 className="font-playfair text-lg text-espresso mb-4">Preise & Rabatte</h3>
          <PricingEditor
            key={apt.id + "-pricing"}
            apt={apt}
            onSaved={updateApartment}
          />
        </div>
      </div>
    </div>
  );
}
