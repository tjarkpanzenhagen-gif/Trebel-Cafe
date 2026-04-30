# Ferienwohnungen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a vacation rental booking feature to the Trebelcafé website — two named apartments, bookable via email inquiry, with admin-managed availability, pricing, and discounts.

**Architecture:** JSON file (`data/fewo.json`) stores all apartment data (pricing, discounts, blocked dates), read/written via `src/lib/fewo-store.ts` (mirrors `src/lib/menu-store.ts`). Three API routes handle public reads and authenticated writes. Two new public pages (`/ferienwohnungen` overview + `/ferienwohnungen/[slug]` detail) and a new FeWo tab in the existing admin dashboard.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS 4, react-day-picker (already installed), Framer Motion (already installed). No test runner configured — verification is manual via `npm run dev`.

**Spec:** `docs/superpowers/specs/2026-04-30-ferienwohnungen-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| CREATE | `data/fewo.json` | Persistent apartment data (pricing, discounts, blocked dates) |
| CREATE | `src/lib/fewo-store.ts` | Types + `readFewo` / `writeFewo` functions |
| CREATE | `src/app/api/fewo/route.ts` | GET all apartments (public) |
| CREATE | `src/app/api/fewo/[id]/route.ts` | PUT apartment pricing + info (admin) |
| CREATE | `src/app/api/fewo/[id]/availability/route.ts` | PUT blocked dates (admin) |
| MODIFY | `src/components/layout/Navigation.tsx` | Add "Ferienwohnungen" nav link |
| CREATE | `src/app/(main)/ferienwohnungen/page.tsx` | Overview page — both apartments scrollable |
| CREATE | `src/app/(main)/ferienwohnungen/[slug]/page.tsx` | Detail page — gallery, calendar, booking form |
| CREATE | `src/components/fewo/ApartmentCard.tsx` | Card used on overview page |
| CREATE | `src/components/fewo/PricingTable.tsx` | Shared pricing + discount display |
| CREATE | `src/components/fewo/AvailabilityCalendar.tsx` | Read-only react-day-picker showing free/blocked days |
| CREATE | `src/components/fewo/BookingForm.tsx` | Date inputs, guest fields, live price calc, mailto submit |
| CREATE | `src/components/fewo/WeeklyMenuTeaser.tsx` | Fetches /api/menu and shows Wochenkarte items |
| CREATE | `src/components/admin/FewoPanel.tsx` | Full admin panel: calendar + price/discount inputs per apartment |
| MODIFY | `src/app/admin/dashboard/page.tsx` | Add "Ferienwohnungen" tab + render FewoPanel |

---

## Task 1: Data Layer — `fewo.json` + `fewo-store.ts`

**Files:**
- Create: `data/fewo.json`
- Create: `src/lib/fewo-store.ts`

- [ ] **Step 1: Create `data/fewo.json`**

```json
{
  "apartments": [
    {
      "id": "wohnung-1",
      "slug": "wohnung-1",
      "name": "Wohnung 1",
      "description": "Gemütliche Ferienwohnung direkt am Trebelcafé.",
      "details": "Unsere erste Ferienwohnung bietet alles was Sie für einen erholsamen Aufenthalt brauchen. Genießen Sie die ruhige Lage und das besondere Ambiente des Trebelcafés direkt vor der Tür.",
      "maxPersons": 3,
      "images": [],
      "pricing": {
        "perNight": 80,
        "extraBed": 15,
        "cleaningFee": 40
      },
      "discounts": {
        "threeNights": 5,
        "sevenNights": 10
      },
      "blockedDates": []
    },
    {
      "id": "wohnung-2",
      "slug": "wohnung-2",
      "name": "Wohnung 2",
      "description": "Helle Ferienwohnung mit besonderem Charme.",
      "details": "Unsere zweite Ferienwohnung überzeugt durch ihre helle und freundliche Atmosphäre. Ein idealer Rückzugsort nach einem Tag voller Erlebnisse in der Region.",
      "maxPersons": 4,
      "images": [],
      "pricing": {
        "perNight": 90,
        "extraBed": 15,
        "cleaningFee": 40
      },
      "discounts": {
        "threeNights": 5,
        "sevenNights": 10
      },
      "blockedDates": []
    }
  ]
}
```

- [ ] **Step 2: Create `src/lib/fewo-store.ts`**

```typescript
export type ApartmentPricing = {
  perNight: number;
  extraBed: number;
  cleaningFee: number;
};

export type ApartmentDiscounts = {
  threeNights: number;
  sevenNights: number;
};

export type Apartment = {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string;
  maxPersons: number;
  images: string[];
  pricing: ApartmentPricing;
  discounts: ApartmentDiscounts;
  blockedDates: string[];
};

export type FewoData = {
  apartments: Apartment[];
};

const KV_KEY = "trebelcafe_fewo";
const KV_URL = process.env.trebelcafe_KV_REST_API_URL;
const KV_TOKEN = process.env.trebelcafe_KV_REST_API_TOKEN;

function hasKVCredentials() {
  return Boolean(KV_URL && KV_TOKEN);
}

async function getKV() {
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: KV_URL!, token: KV_TOKEN! });
}

async function getInitialData(): Promise<FewoData> {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  return JSON.parse(readFileSync(join(process.cwd(), "data", "fewo.json"), "utf-8"));
}

export async function readFewo(): Promise<FewoData> {
  if (hasKVCredentials()) {
    try {
      const kv = await getKV();
      const data = await kv.get<FewoData>(KV_KEY);
      if (!data) {
        const initial = await getInitialData();
        await kv.set(KV_KEY, initial);
        return initial;
      }
      return data;
    } catch {
      return getInitialData();
    }
  }
  if (!process.env.VERCEL) {
    const { readFileSync } = await import("fs");
    const { join } = await import("path");
    try {
      return JSON.parse(readFileSync(join(process.cwd(), "data", "fewo.json"), "utf-8"));
    } catch {
      return getInitialData();
    }
  }
  return getInitialData();
}

export async function writeFewo(data: FewoData): Promise<void> {
  if (hasKVCredentials()) {
    const kv = await getKV();
    await kv.set(KV_KEY, data);
    return;
  }
  if (!process.env.VERCEL) {
    const { writeFileSync } = await import("fs");
    const { join } = await import("path");
    writeFileSync(join(process.cwd(), "data", "fewo.json"), JSON.stringify(data, null, 2));
    return;
  }
  throw new Error("KV_REST_API_URL und KV_REST_API_TOKEN fehlen in den Vercel Env-Variablen.");
}

export function calculatePrice(
  nights: number,
  extraBeds: number,
  pricing: ApartmentPricing,
  discounts: ApartmentDiscounts
): { nightsTotal: number; discountPercent: number; discountAmount: number; extraBedTotal: number; total: number } {
  const nightsTotal = nights * pricing.perNight;
  const discountPercent =
    nights >= 7 ? discounts.sevenNights : nights >= 3 ? discounts.threeNights : 0;
  const discountAmount = Math.round((nightsTotal * discountPercent) / 100 * 100) / 100;
  const discountedNights = nightsTotal - discountAmount;
  const extraBedTotal = extraBeds * pricing.extraBed;
  const total = Math.round((discountedNights + extraBedTotal + pricing.cleaningFee) * 100) / 100;
  return { nightsTotal, discountPercent, discountAmount, extraBedTotal, total };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd "C:/Users/Drest/Desktop/Clients/Trebel-Cafe/trebelcafe" && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add data/fewo.json src/lib/fewo-store.ts
git commit -m "feat: add fewo data layer and types"
```

---

## Task 2: API Routes

**Files:**
- Create: `src/app/api/fewo/route.ts`
- Create: `src/app/api/fewo/[id]/route.ts`
- Create: `src/app/api/fewo/[id]/availability/route.ts`

- [ ] **Step 1: Create `src/app/api/fewo/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { readFewo } from "@/lib/fewo-store";

export async function GET() {
  try {
    const data = await readFewo();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `src/app/api/fewo/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readFewo, writeFewo } from "@/lib/fewo-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, details, maxPersons, pricing, discounts } = body;
    if (!name || !pricing?.perNight || !discounts) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    const data = await readFewo();
    const index = data.apartments.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    data.apartments[index] = {
      ...data.apartments[index],
      name,
      description,
      details,
      maxPersons: Number(maxPersons),
      pricing: {
        perNight: Number(pricing.perNight),
        extraBed: Number(pricing.extraBed),
        cleaningFee: Number(pricing.cleaningFee),
      },
      discounts: {
        threeNights: Number(discounts.threeNights),
        sevenNights: Number(discounts.sevenNights),
      },
    };
    await writeFewo(data);
    return NextResponse.json(data.apartments[index]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create `src/app/api/fewo/[id]/availability/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { readFewo, writeFewo } from "@/lib/fewo-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { blockedDates } = body;
    if (!Array.isArray(blockedDates)) {
      return NextResponse.json({ error: "blockedDates muss ein Array sein" }, { status: 400 });
    }
    const data = await readFewo();
    const index = data.apartments.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    data.apartments[index].blockedDates = blockedDates;
    await writeFewo(data);
    return NextResponse.json({ ok: true, blockedDates });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
```

- [ ] **Step 4: Verify API routes work**

Run `npm run dev` in the project directory. Then in a browser visit: `http://localhost:3000/api/fewo`
Expected: JSON with both apartments

- [ ] **Step 5: Commit**

```bash
git add src/app/api/fewo/
git commit -m "feat: add fewo API routes (GET all, PUT pricing, PUT availability)"
```

---

## Task 3: Navigation

**Files:**
- Modify: `src/components/layout/Navigation.tsx`

- [ ] **Step 1: Add "Ferienwohnungen" to `navLinks` array**

In `src/components/layout/Navigation.tsx`, find the `navLinks` array (line 8) and replace it:

```typescript
const navLinks = [
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/ferienwohnungen", label: "Ferienwohnungen" },
  { href: "/galerie", label: "Galerie" },
];
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open `http://localhost:3000` and confirm "Ferienwohnungen" appears in the nav bar (desktop and mobile).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navigation.tsx
git commit -m "feat: add Ferienwohnungen nav link"
```

---

## Task 4: Shared Components — PricingTable, AvailabilityCalendar

**Files:**
- Create: `src/components/fewo/PricingTable.tsx`
- Create: `src/components/fewo/AvailabilityCalendar.tsx`

- [ ] **Step 1: Create `src/components/fewo/PricingTable.tsx`**

```typescript
import type { ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-store";

type Props = {
  pricing: ApartmentPricing;
  discounts: ApartmentDiscounts;
};

export default function PricingTable({ pricing, discounts }: Props) {
  return (
    <div className="bg-sand/40 rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-dm text-sm text-espresso">Preis / Nacht</span>
        <span className="font-playfair text-terracotta font-semibold">{pricing.perNight} €</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-dm text-sm text-espresso/70">Aufbettung</span>
        <span className="font-dm text-sm text-espresso">{pricing.extraBed} € / Person</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-dm text-sm text-espresso/70">Endreinigung</span>
        <span className="font-dm text-sm text-espresso">{pricing.cleaningFee} €</span>
      </div>
      <div className="border-t border-sand pt-3 space-y-1.5">
        <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider mb-2">Rabatte</p>
        <div className="flex justify-between items-center">
          <span className="font-dm text-sm text-sage">✓ Ab 3 Nächten</span>
          <span className="font-dm text-sm font-medium text-sage">{discounts.threeNights}% Rabatt</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-dm text-sm text-sage">✓ Ab 7 Nächten</span>
          <span className="font-dm text-sm font-medium text-sage">{discounts.sevenNights}% Rabatt</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/fewo/AvailabilityCalendar.tsx`**

```typescript
"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMemo } from "react";

type Props = {
  blockedDates: string[];
};

export default function AvailabilityCalendar({ blockedDates }: Props) {
  const blocked = useMemo(
    () => blockedDates.map((d) => new Date(d + "T00:00:00")),
    [blockedDates]
  );

  return (
    <div className="fewo-calendar">
      <style>{`
        .fewo-calendar .rdp {
          --rdp-accent-color: #C4724A;
          --rdp-background-color: #E8D5C0;
          margin: 0;
        }
        .fewo-calendar .rdp-day_blocked {
          background-color: #C4724A !important;
          color: white !important;
          border-radius: 4px;
          opacity: 1 !important;
        }
        .fewo-calendar .rdp-day_blocked:hover {
          background-color: #C4724A !important;
          cursor: default;
        }
        .fewo-calendar .rdp-day {
          font-family: var(--font-dm-sans, sans-serif);
          font-size: 13px;
        }
        .fewo-calendar .rdp-caption_label {
          font-family: var(--font-playfair, serif);
          color: #2C1810;
        }
      `}</style>
      <DayPicker
        mode="multiple"
        selected={blocked}
        modifiers={{ blocked }}
        modifiersClassNames={{ blocked: "rdp-day_blocked" }}
        disabled={blocked}
        fromDate={new Date()}
        numberOfMonths={1}
      />
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#6B7C5E]" />
          <span className="font-dm text-xs text-espresso/60">Frei</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-terracotta" />
          <span className="font-dm text-xs text-espresso/60">Belegt</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/fewo/
git commit -m "feat: add shared fewo components (PricingTable, AvailabilityCalendar)"
```

---

## Task 5: BookingForm + WeeklyMenuTeaser

**Files:**
- Create: `src/components/fewo/BookingForm.tsx`
- Create: `src/components/fewo/WeeklyMenuTeaser.tsx`

- [ ] **Step 1: Create `src/components/fewo/BookingForm.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import type { ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-store";
import { calculatePrice } from "@/lib/fewo-store";

type Props = {
  apartmentName: string;
  apartmentId: string;
  pricing: ApartmentPricing;
  discounts: ApartmentDiscounts;
  blockedDates: string[];
};

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function hasBlockedInRange(checkIn: string, checkOut: string, blockedDates: string[]): boolean {
  if (!checkIn || !checkOut) return false;
  const blocked = new Set(blockedDates);
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    if (blocked.has(d.toISOString().slice(0, 10))) return true;
  }
  return false;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingForm({ apartmentName, apartmentId, pricing, discounts, blockedDates }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [persons, setPersons] = useState(1);
  const [extraBeds, setExtraBeds] = useState(0);
  const [message, setMessage] = useState("");
  const [rangeError, setRangeError] = useState("");

  const nights = getNights(checkIn, checkOut);

  useEffect(() => {
    if (checkIn && checkOut && hasBlockedInRange(checkIn, checkOut, blockedDates)) {
      setRangeError("Der gewählte Zeitraum enthält bereits belegte Tage. Bitte wählen Sie einen anderen Zeitraum.");
    } else {
      setRangeError("");
    }
  }, [checkIn, checkOut, blockedDates]);

  const priceCalc = nights > 0 ? calculatePrice(nights, extraBeds, pricing, discounts) : null;

  function buildMailBody() {
    const lines = [
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
      priceCalc ? `Geschätzter Gesamtpreis: ${priceCalc.total.toFixed(2)} €` : "",
      priceCalc && priceCalc.discountPercent > 0
        ? `(inkl. ${priceCalc.discountPercent}% Rabatt für ${nights} Nächte)`
        : "",
      ``,
      `Nachricht: ${message || "–"}`,
    ];
    return lines.filter((l) => l !== undefined).join("\n");
  }

  const canSubmit =
    nights > 0 &&
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    !rangeError;

  return (
    <div className="space-y-5">
      <h3 className="font-playfair text-xl text-espresso">Buchungsanfrage</h3>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-1">Anreise *</label>
          <input
            type="date"
            min={todayString()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-1">Abreise *</label>
          <input
            type="date"
            min={checkIn || todayString()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
      </div>

      {rangeError && (
        <p className="font-dm text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{rangeError}</p>
      )}

      {/* Guest fields */}
      <div>
        <label className="block font-dm text-sm text-espresso/70 mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-1">E-Mail *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-1">Telefon *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-1">Personen</label>
          <input
            type="number"
            min={1}
            max={10}
            value={persons}
            onChange={(e) => setPersons(Number(e.target.value))}
            className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
        <div>
          <label className="block font-dm text-sm text-espresso/70 mb-1">Aufbettung (Anz.)</label>
          <input
            type="number"
            min={0}
            max={5}
            value={extraBeds}
            onChange={(e) => setExtraBeds(Number(e.target.value))}
            className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block font-dm text-sm text-espresso/70 mb-1">Nachricht (optional)</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors resize-none"
        />
      </div>

      {/* Live price calculation */}
      {priceCalc && !rangeError && (
        <div className="bg-sand/40 rounded-2xl p-5 space-y-2">
          <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider mb-3">Preisübersicht</p>
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
              <span className="font-dm text-sm text-espresso/70">Aufbettung ({extraBeds}×)</span>
              <span className="font-dm text-sm text-espresso">{priceCalc.extraBedTotal.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-dm text-sm text-espresso/70">Endreinigung</span>
            <span className="font-dm text-sm text-espresso">{pricing.cleaningFee.toFixed(2)} €</span>
          </div>
          <div className="border-t border-sand pt-3 flex justify-between">
            <span className="font-playfair text-base text-espresso font-semibold">Gesamt (ca.)</span>
            <span className="font-playfair text-terracotta text-base font-semibold">{priceCalc.total.toFixed(2)} €</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <a
        href={canSubmit
          ? `mailto:trebelcafe@gmx.de?subject=Buchungsanfrage: ${encodeURIComponent(apartmentName)}&body=${encodeURIComponent(buildMailBody())}`
          : undefined}
        onClick={!canSubmit ? (e) => e.preventDefault() : undefined}
        className={`block w-full text-center px-6 py-3 rounded-full font-dm text-sm font-medium transition-all duration-300 ${
          canSubmit
            ? "bg-terracotta text-white hover:bg-[#b3623c] cursor-pointer"
            : "bg-sand text-espresso/40 cursor-not-allowed"
        }`}
      >
        Anfrage senden →
      </a>
      <p className="font-dm text-xs text-espresso/40 text-center">
        Dies öffnet Ihr E-Mail-Programm. Wir melden uns schnellstmöglich zurück.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/fewo/WeeklyMenuTeaser.tsx`**

```typescript
import type { MenuItem } from "@/lib/menu-store";
import SectionLabel from "@/components/ui/SectionLabel";

async function getWochenkarte(): Promise<MenuItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/menu`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const items: MenuItem[] = await res.json();
    return items.filter((i) => i.kategorie === "wochenkarte").slice(0, 3);
  } catch {
    return [];
  }
}

export default async function WeeklyMenuTeaser() {
  const dishes = await getWochenkarte();

  if (dishes.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-sand/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>Inklusive für Gäste</SectionLabel>
          <h2 className="font-playfair text-3xl text-espresso">
            🍳 Essen im Trebelcafé
          </h2>
          <p className="font-dm text-sm text-espresso/60 mt-3 max-w-md mx-auto">
            Als Feriengast genießen Sie unsere aktuellen Wochenangebote direkt vor Ort.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="border border-sand rounded-2xl p-5 bg-cream hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="w-6 h-px bg-terracotta mb-3" />
              <h3 className="font-playfair text-lg text-espresso mb-1">{dish.name}</h3>
              <p className="font-dm text-xs text-espresso/60 leading-relaxed">{dish.description}</p>
              <p className="font-playfair text-terracotta mt-3 font-semibold">{dish.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/fewo/
git commit -m "feat: add BookingForm and WeeklyMenuTeaser components"
```

---

## Task 6: ApartmentCard + Overview Page

**Files:**
- Create: `src/components/fewo/ApartmentCard.tsx`
- Create: `src/app/(main)/ferienwohnungen/page.tsx`

- [ ] **Step 1: Create `src/components/fewo/ApartmentCard.tsx`**

```typescript
import Link from "next/link";
import type { Apartment } from "@/lib/fewo-store";
import PricingTable from "@/components/fewo/PricingTable";
import AnimatedSection from "@/components/ui/AnimatedSection";

type Props = {
  apartment: Apartment;
  delay?: number;
};

const PLACEHOLDER_COLORS = [
  "bg-[#C8B89A]",
  "bg-[#D4C4AC]",
  "bg-[#BFB090]",
  "bg-[#C0AD95]",
];

export default function ApartmentCard({ apartment, delay = 0 }: Props) {
  const hasImages = apartment.images.length > 0;

  return (
    <AnimatedSection delay={delay} className="border-b border-sand last:border-b-0">
      <div className="py-12 px-6 max-w-4xl mx-auto">
        {/* Image grid */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-8 h-56">
          {hasImages ? (
            <>
              <div className="col-span-2 bg-sand relative">
                <img
                  src={apartment.images[0]}
                  alt={apartment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-2">
                {apartment.images.slice(1, 3).map((src, i) => (
                  <div key={i} className="bg-sand relative">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={`col-span-2 ${PLACEHOLDER_COLORS[0]} flex items-center justify-center`}>
                <span className="font-dm text-xs text-espresso/40">Fotos folgen</span>
              </div>
              <div className="grid grid-rows-2 gap-2">
                <div className={`${PLACEHOLDER_COLORS[1]}`} />
                <div className={`${PLACEHOLDER_COLORS[2]}`} />
              </div>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="font-dm text-xs text-espresso/40 uppercase tracking-widest">Ferienwohnung</span>
            <h2 className="font-playfair text-3xl text-espresso mt-1 mb-3">{apartment.name}</h2>
            <p className="font-dm text-sm text-espresso/70 leading-relaxed mb-4">{apartment.description}</p>
            <p className="font-dm text-xs text-espresso/50">Bis zu {apartment.maxPersons} Personen</p>
          </div>
          <div className="space-y-4">
            <PricingTable pricing={apartment.pricing} discounts={apartment.discounts} />
            <Link
              href={`/ferienwohnungen/${apartment.slug}`}
              className="block w-full text-center px-6 py-3 rounded-full bg-espresso text-cream font-dm text-sm font-medium hover:bg-terracotta transition-all duration-300"
            >
              Zum Angebot →
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Create `src/app/(main)/ferienwohnungen/page.tsx`**

```typescript
import { readFewo } from "@/lib/fewo-store";
import ApartmentCard from "@/components/fewo/ApartmentCard";
import WeeklyMenuTeaser from "@/components/fewo/WeeklyMenuTeaser";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferienwohnungen | Trebelcafé",
  description: "Übernachten Sie direkt am Trebelcafé. Zwei gemütliche Ferienwohnungen mit Frühstück inklusive.",
};

export default async function FerienwohnungenPage() {
  const data = await readFewo();

  return (
    <main>
      {/* Hero */}
      <section className="bg-terracotta text-cream py-20 px-6 text-center">
        <SectionLabel className="text-cream/70">Übernachten</SectionLabel>
        <h1 className="font-playfair text-4xl md:text-5xl mt-2 mb-4">
          Ferienwohnungen im Trebelcafé
        </h1>
        <p className="font-dm text-cream/80 max-w-md mx-auto text-sm leading-relaxed">
          Zwei gemütliche Wohnungen direkt am Café — wachen Sie auf und genießen Sie unser Frühstück.
        </p>
      </section>

      {/* Apartments */}
      <section className="bg-cream">
        {data.apartments.map((apt, i) => (
          <ApartmentCard key={apt.id} apartment={apt} delay={i * 0.1} />
        ))}
      </section>

      {/* Weekly menu teaser */}
      <WeeklyMenuTeaser />
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/ferienwohnungen` — should show hero, two apartment cards with placeholder image grid, pricing tables, discount info, "Zum Angebot" buttons, and weekly menu teaser at the bottom.

- [ ] **Step 4: Commit**

```bash
git add src/components/fewo/ApartmentCard.tsx src/app/\(main\)/ferienwohnungen/page.tsx
git commit -m "feat: add ferienwohnungen overview page"
```

---

## Task 7: Detail Page

**Files:**
- Create: `src/app/(main)/ferienwohnungen/[slug]/page.tsx`

- [ ] **Step 1: Create `src/app/(main)/ferienwohnungen/[slug]/page.tsx`**

```typescript
import { readFewo } from "@/lib/fewo-store";
import { notFound } from "next/navigation";
import Link from "next/link";
import PricingTable from "@/components/fewo/PricingTable";
import AvailabilityCalendar from "@/components/fewo/AvailabilityCalendar";
import BookingForm from "@/components/fewo/BookingForm";
import WeeklyMenuTeaser from "@/components/fewo/WeeklyMenuTeaser";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const data = await readFewo();
  return data.apartments.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await readFewo();
  const apt = data.apartments.find((a) => a.slug === slug);
  return {
    title: apt ? `${apt.name} | Trebelcafé` : "Ferienwohnung | Trebelcafé",
    description: apt?.description,
  };
}

const PLACEHOLDER_COLORS = ["bg-[#C8B89A]", "bg-[#D4C4AC]", "bg-[#BFB090]", "bg-[#C0AD95]"];

export default async function ApartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await readFewo();
  const apt = data.apartments.find((a) => a.slug === slug);
  if (!apt) notFound();

  const hasImages = apt.images.length > 0;

  return (
    <main>
      {/* Header */}
      <section className="bg-espresso text-cream py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/ferienwohnungen"
            className="font-dm text-xs text-cream/50 hover:text-cream transition-colors mb-4 inline-block"
          >
            ← Zurück zur Übersicht
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl">{apt.name}</h1>
          <p className="font-dm text-cream/70 mt-3 max-w-lg">{apt.description}</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {hasImages ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden h-72">
              {apt.images.slice(0, 5).map((src, i) => (
                <div key={i} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 rounded-2xl overflow-hidden h-64">
              {PLACEHOLDER_COLORS.map((cls, i) => (
                <div
                  key={i}
                  className={`${cls} flex items-center justify-center ${i === 0 ? "col-span-2" : ""}`}
                >
                  {i === 0 && (
                    <span className="font-dm text-xs text-espresso/40">Fotos folgen</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Details + Pricing + Calendar + Form */}
      <section className="bg-cream px-6 pb-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left column */}
          <div className="space-y-8">
            <AnimatedSection>
              <h2 className="font-playfair text-2xl text-espresso mb-3">Über die Wohnung</h2>
              <p className="font-dm text-sm text-espresso/70 leading-relaxed">{apt.details}</p>
              <p className="font-dm text-xs text-espresso/50 mt-3">Bis zu {apt.maxPersons} Personen</p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-playfair text-2xl text-espresso mb-3">Preise</h2>
              <PricingTable pricing={apt.pricing} discounts={apt.discounts} />
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <h2 className="font-playfair text-2xl text-espresso mb-3">Verfügbarkeit</h2>
              <p className="font-dm text-xs text-espresso/50 mb-3">
                Terracotta = belegt · Weiß = frei
              </p>
              <AvailabilityCalendar blockedDates={apt.blockedDates} />
            </AnimatedSection>
          </div>

          {/* Right column — booking form */}
          <AnimatedSection delay={0.2} className="bg-sand/30 rounded-2xl p-6">
            <BookingForm
              apartmentName={apt.name}
              apartmentId={apt.id}
              pricing={apt.pricing}
              discounts={apt.discounts}
              blockedDates={apt.blockedDates}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Weekly menu */}
      <WeeklyMenuTeaser />
    </main>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/ferienwohnungen/wohnung-1` — should show espresso header with back link, placeholder gallery, description, pricing table, availability calendar, booking form. Select two dates and verify price calculates live. Verify "Zum Angebot" button is greyed out until name/email/phone are filled.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(main\)/ferienwohnungen/
git commit -m "feat: add apartment detail page with booking form and availability calendar"
```

---

## Task 8: Admin FeWo Panel

**Files:**
- Create: `src/components/admin/FewoPanel.tsx`
- Modify: `src/app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create `src/components/admin/FewoPanel.tsx`**

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
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
        setError(`Fehler: ${err.error ?? "Unbekannt"}`);
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  function numInput(
    label: string,
    value: number,
    onChange: (v: number) => void,
    unit = "€"
  ) {
    return (
      <div>
        <label className="block font-dm text-xs text-espresso/60 mb-1">{label}</label>
        <div className="flex items-center border border-sand rounded-lg focus-within:border-terracotta transition-colors">
          <input
            type="number"
            min={0}
            step={0.01}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 px-3 py-2 font-dm text-sm text-espresso focus:outline-none bg-transparent rounded-l-lg"
          />
          <span className="px-3 font-dm text-xs text-espresso/40">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-dm text-xs text-espresso/40 uppercase tracking-wider">Grundpreise</p>
      {numInput("Preis pro Nacht", pricing.perNight, (v) => setPricing({ ...pricing, perNight: v }))}
      {numInput("Aufbettung pro Person", pricing.extraBed, (v) => setPricing({ ...pricing, extraBed: v }))}
      {numInput("Endreinigung", pricing.cleaningFee, (v) => setPricing({ ...pricing, cleaningFee: v }))}

      <p className="font-dm text-xs text-espresso/40 uppercase tracking-wider pt-2">Rabatte</p>
      {numInput("Ab 3 Nächten", discounts.threeNights, (v) => setDiscounts({ ...discounts, threeNights: v }), "%")}
      {numInput("Ab 7 Nächten", discounts.sevenNights, (v) => setDiscounts({ ...discounts, sevenNights: v }), "%")}

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
        setError(`Fehler: ${err.error ?? "Unbekannt"}`);
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
      <div className="admin-fewo-cal border border-sand rounded-xl p-3 bg-white">
        <DayPicker
          mode="multiple"
          selected={selected}
          onSelect={(days) => setSelected(days ?? [])}
          fromDate={new Date()}
        />
      </div>
      <div className="flex gap-3 items-center">
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
```

- [ ] **Step 2: Modify `src/app/admin/dashboard/page.tsx`**

At the top of the file, add the import after the existing imports:

```typescript
import FewoPanel from "@/components/admin/FewoPanel";
import { readFewo } from "@/lib/fewo-store";
import type { Apartment } from "@/lib/fewo-store";
```

Change the component signature from `export default function AdminDashboardPage()` to:

```typescript
export default async function AdminDashboardPage() {
  const fewoData = await readFewo();
```

In `TABS`, the type `Kategorie` currently drives `activeTab`. Add `"fewo"` as a possible tab value. Replace the TABS constant and activeTab type at the top of the file's client-rendered content.

Since the dashboard is a `"use client"` component and we need to fetch `fewoData` server-side, the cleanest approach is to split the file: keep the current dashboard as a pure client component `AdminDashboardClient` and wrap it in a server component. Here is the full replacement for `src/app/admin/dashboard/page.tsx`:

```typescript
import { readFewo } from "@/lib/fewo-store";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const fewoData = await readFewo();
  return <AdminDashboardClient initialFewoApartments={fewoData.apartments} />;
}
```

- [ ] **Step 3: Create `src/components/admin/AdminDashboardClient.tsx`**

Take the full contents of the current `src/app/admin/dashboard/page.tsx` (the entire client component), save them as `src/components/admin/AdminDashboardClient.tsx`, and make these changes:

1. Change the export from `export default function AdminDashboardPage()` to `export default function AdminDashboardClient({ initialFewoApartments }: { initialFewoApartments: Apartment[] })`

2. Add `import type { Apartment } from "@/lib/fewo-store";` at the top

3. Add `import FewoPanel from "@/components/admin/FewoPanel";` at the top

4. Change the `Kategorie` type and `activeTab` state to support the fewo tab:

Replace:
```typescript
type Kategorie = "wochenkarte" | "kuchenUndGebaeck" | "getraenke";
```
With:
```typescript
type Kategorie = "wochenkarte" | "kuchenUndGebaeck" | "getraenke";
type TabKey = Kategorie | "fewo";
```

Replace:
```typescript
const [activeTab, setActiveTab] = useState<Kategorie>("wochenkarte");
```
With:
```typescript
const [activeTab, setActiveTab] = useState<TabKey>("wochenkarte");
```

5. Add the FeWo tab to the `TABS` array:
```typescript
const TABS: { key: TabKey; label: string }[] = [
  { key: "wochenkarte", label: "Wochenkarte" },
  { key: "kuchenUndGebaeck", label: "Kuchen & Gebäck" },
  { key: "getraenke", label: "Getränke" },
  { key: "fewo", label: "🏠 Ferienwohnungen" },
];
```

6. Before the closing `</div>` of the tab content area (after the item grid section), add:
```typescript
{activeTab === "fewo" && (
  <FewoPanel initialApartments={initialFewoApartments} />
)}
```

7. The existing item grid and "Neues Gericht" button should only render when `activeTab !== "fewo"`:

Wrap the tab content header div and item grid in:
```typescript
{activeTab !== "fewo" && (
  <>
    {/* Tab content header */}
    <div className="flex items-center justify-between mb-6">
      ...
    </div>
    {/* Item grid */}
    ...
  </>
)}
```

- [ ] **Step 4: Verify admin panel**

Open `http://localhost:3000/admin` — log in with credentials from `.env.local`. Click the "🏠 Ferienwohnungen" tab. Should show sub-tabs for both apartments, calendar on the left, pricing/discount inputs on the right. Toggle some days in the calendar and click "Verfügbarkeit speichern" — verify the calendar on the public detail page reflects the change after a page refresh.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/ src/app/admin/dashboard/page.tsx
git commit -m "feat: add fewo admin panel with availability calendar and pricing editor"
```

---

## Task 9: Final Polish + `.gitignore`

**Files:**
- Modify: `.gitignore` (add `.superpowers/`)

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and add at the end:
```
# Brainstorming mockups
.superpowers/
```

- [ ] **Step 2: Verify full flow end-to-end**

1. Open `http://localhost:3000/ferienwohnungen` — see both apartments with pricing and discounts
2. Click "Zum Angebot →" on Wohnung 1 — lands on detail page
3. Select a 4-night stay — verify 5% discount appears in price breakdown
4. Select a 7-night stay — verify 10% discount
5. Fill in name, email, phone — "Anfrage senden" button becomes active
6. Click "Anfrage senden" — email client opens with pre-filled subject and body
7. Log in to admin, go to FeWo tab, block some dates for Wohnung 1
8. Return to the public detail page — blocked dates shown in terracotta on the calendar
9. Try selecting a date range that includes a blocked day in the booking form — error message appears

- [ ] **Step 3: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to .gitignore"
```

---

## Self-Review Checklist

- [x] `data/fewo.json` — Task 1
- [x] `lib/fewo-store.ts` with types + `calculatePrice` — Task 1
- [x] GET `/api/fewo` — Task 2
- [x] PUT `/api/fewo/[id]` — Task 2
- [x] PUT `/api/fewo/[id]/availability` — Task 2
- [x] Nav link "Ferienwohnungen" after "Über uns" — Task 3
- [x] `PricingTable` shared component — Task 4
- [x] `AvailabilityCalendar` (read-only, react-day-picker) — Task 4
- [x] `BookingForm` with live price calc + blocked date validation + mailto — Task 5
- [x] `WeeklyMenuTeaser` fetching `/api/menu` (wochenkarte only) — Task 5
- [x] `ApartmentCard` with placeholder image grid — Task 6
- [x] Overview page `/ferienwohnungen` — Task 6
- [x] Detail page `/ferienwohnungen/[slug]` — Task 7
- [x] `FewoPanel` admin component (availability editor + pricing editor) — Task 8
- [x] Admin dashboard split into server/client + FeWo tab added — Task 8
- [x] Discounts admin-adjustable — Task 8 (`PricingEditor`)
- [x] Blocked dates per apartment (separate) — Task 8
- [x] Weekly menu shown on both public pages — Task 5/6/7
