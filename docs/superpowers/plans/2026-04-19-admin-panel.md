# Admin Panel & Speisekarten-Filter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Passwortgeschütztes Admin-Panel zum Verwalten der Speisekarte (CRUD + Diät-Flags), plus Filter auf der öffentlichen Speisekarte.

**Architecture:** Menüdaten werden in `data/menu.json` gespeichert und über Next.js Route Handlers gelesen/geschrieben. Authentifizierung via HttpOnly-Cookie. Öffentliche Seiten laufen in der `(main)` Route-Gruppe mit Navigation+Footer; das Admin-Panel hat ein eigenes Layout ohne Nav/Footer.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Node.js `fs` für Datei-I/O

---

## File Map

| Aktion | Datei | Zweck |
|--------|-------|-------|
| Erstellen | `data/menu.json` | Persistente Speisekartendaten |
| Erstellen | `src/app/api/menu/route.ts` | GET + POST für Menüeinträge |
| Erstellen | `src/app/api/menu/[id]/route.ts` | PUT + DELETE für einzelne Einträge |
| Erstellen | `src/app/api/auth/route.ts` | Login (POST) + Logout (DELETE) |
| Erstellen | `src/middleware.ts` | Schützt `/admin/dashboard` gegen unauthentifizierte Zugriffe |
| Erstellen | `src/app/(main)/layout.tsx` | Layout mit Navigation + Footer für öffentliche Seiten |
| Ändern | `src/app/layout.tsx` | Navigation + Footer entfernen (nur noch html/body) |
| Verschieben | `src/app/page.tsx` → `src/app/(main)/page.tsx` | In Route-Gruppe verschoben |
| Neu schreiben | `src/app/(main)/speisekarte/page.tsx` | Client Component mit Filter — komplett neu (Task 11), **nicht** aus alter Datei kopieren |
| Verschieben | `src/app/galerie/page.tsx` → `src/app/(main)/galerie/page.tsx` | In Route-Gruppe verschoben |
| Verschieben | `src/app/reservierung/page.tsx` → `src/app/(main)/reservierung/page.tsx` | In Route-Gruppe verschoben |
| Verschieben | `src/app/ueber-uns/page.tsx` → `src/app/(main)/ueber-uns/page.tsx` | In Route-Gruppe verschoben |
| Verschieben | `src/app/impressum/page.tsx` → `src/app/(main)/impressum/page.tsx` | In Route-Gruppe verschoben |
| Verschieben | `src/app/datenschutz/page.tsx` → `src/app/(main)/datenschutz/page.tsx` | In Route-Gruppe verschoben |
| Erstellen | `src/app/admin/layout.tsx` | Minimales Admin-Layout ohne Nav/Footer |
| Erstellen | `src/app/admin/page.tsx` | Login-Seite |
| Erstellen | `src/app/admin/dashboard/page.tsx` | Admin-Dashboard mit Tabs + CRUD |

---

## Task 1: Datendatei erstellen

**Files:**
- Create: `data/menu.json`

- [ ] **Schritt 1: `data/menu.json` anlegen**

Erstelle die Datei `data/menu.json` mit diesem Inhalt (bestehende Einträge aus `content.ts` migriert, alle Diät-Flags auf `false`):

```json
[
  {
    "id": "1",
    "name": "Käse-Schinken-Salat",
    "description": "Frischer Salat mit würzigem Käse und feinem Schinken",
    "price": "9,90 €",
    "vegan": false,
    "vegetarisch": false,
    "glutenfrei": true,
    "kategorie": "wochenkarte"
  },
  {
    "id": "2",
    "name": "Ofenkartoffel mit Quark",
    "description": "Knusprige Ofenkartoffel mit hausgemachtem Kräuterquark",
    "price": "10,50 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "wochenkarte"
  },
  {
    "id": "3",
    "name": "Kartoffelpuffer mit Fisch",
    "description": "Goldbraune Kartoffelpuffer mit Räucherfischfilet",
    "price": "13,90 €",
    "vegan": false,
    "vegetarisch": false,
    "glutenfrei": false,
    "kategorie": "wochenkarte"
  },
  {
    "id": "4",
    "name": "Ziegenkäse-Salat",
    "description": "Gemischter Salat mit warmem Ziegenkäse und Walnüssen",
    "price": "12,50 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "wochenkarte"
  },
  {
    "id": "5",
    "name": "Bauerfrühstück",
    "description": "Herzhaftes Frühstück mit Ei, Speck und frischem Brot",
    "price": "16,50 €",
    "vegan": false,
    "vegetarisch": false,
    "glutenfrei": false,
    "kategorie": "wochenkarte"
  },
  {
    "id": "6",
    "name": "Hausgemachter Kuchen des Tages",
    "description": "Täglich wechselnd, alles selbst gebacken",
    "price": "3,50 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": false,
    "kategorie": "kuchenUndGebaeck"
  },
  {
    "id": "7",
    "name": "Käsekuchen",
    "description": "Cremig und leicht, nach Familienrezept",
    "price": "3,80 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": false,
    "kategorie": "kuchenUndGebaeck"
  },
  {
    "id": "8",
    "name": "Streuselkuchen",
    "description": "Buttrig-knuspriger Streuselkuchen vom Blech",
    "price": "3,50 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": false,
    "kategorie": "kuchenUndGebaeck"
  },
  {
    "id": "9",
    "name": "Brot & Brötchen",
    "description": "Frisch gebacken, täglich",
    "price": "ab 1,20 €",
    "vegan": true,
    "vegetarisch": true,
    "glutenfrei": false,
    "kategorie": "kuchenUndGebaeck"
  },
  {
    "id": "10",
    "name": "Filterkaffee",
    "description": "Frisch gebrüht",
    "price": "2,50 €",
    "vegan": true,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "getraenke"
  },
  {
    "id": "11",
    "name": "Cappuccino",
    "description": "Mit cremigem Milchschaum",
    "price": "3,20 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "getraenke"
  },
  {
    "id": "12",
    "name": "Latte Macchiato",
    "description": "Groß und samtig",
    "price": "3,50 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "getraenke"
  },
  {
    "id": "13",
    "name": "Tee (Kanne)",
    "description": "Auswahl an Sorten",
    "price": "3,00 €",
    "vegan": true,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "getraenke"
  },
  {
    "id": "14",
    "name": "Hausgemachte Limonade",
    "description": "Zitrone-Minze oder Holunder",
    "price": "3,80 €",
    "vegan": true,
    "vegetarisch": true,
    "glutenfrei": true,
    "kategorie": "getraenke"
  },
  {
    "id": "15",
    "name": "Kuchen & Kaffee (Set)",
    "description": "Ein Stück Kuchen + Filterkaffee",
    "price": "6,50 €",
    "vegan": false,
    "vegetarisch": true,
    "glutenfrei": false,
    "kategorie": "getraenke"
  }
]
```

---

## Task 2: Menu API Route (GET + POST)

**Files:**
- Create: `src/app/api/menu/route.ts`

- [ ] **Schritt 1: `src/app/api/menu/route.ts` erstellen**

```typescript
import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";

const DATA_PATH = join(process.cwd(), "data", "menu.json");

function readMenu() {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeMenu(data: unknown) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "1";
}

export async function GET() {
  const items = readMenu();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, description, price, vegan, vegetarisch, glutenfrei, kategorie } = body;
  if (!name || !description || !price || !kategorie) {
    return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
  }
  const items = readMenu();
  const newItem = {
    id: crypto.randomUUID(),
    name,
    description,
    price,
    vegan: Boolean(vegan),
    vegetarisch: Boolean(vegetarisch),
    glutenfrei: Boolean(glutenfrei),
    kategorie,
  };
  items.push(newItem);
  writeMenu(items);
  return NextResponse.json(newItem, { status: 201 });
}
```

- [ ] **Schritt 2: Manuell testen**

Dev-Server laufen lassen (`npm run dev`), dann im Browser aufrufen:
```
http://localhost:3000/api/menu
```
Erwartetes Ergebnis: JSON-Array mit 15 Einträgen.

---

## Task 3: Menu [id] API Route (PUT + DELETE)

**Files:**
- Create: `src/app/api/menu/[id]/route.ts`

- [ ] **Schritt 1: `src/app/api/menu/[id]/route.ts` erstellen**

```typescript
import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";

const DATA_PATH = join(process.cwd(), "data", "menu.json");

function readMenu() {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeMenu(data: unknown) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "1";
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const { name, description, price, vegan, vegetarisch, glutenfrei, kategorie } = body;
  if (!name || !description || !price || !kategorie) {
    return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
  }
  const items: Array<{ id: string; [key: string]: unknown }> = readMenu();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }
  items[index] = {
    id,
    name,
    description,
    price,
    vegan: Boolean(vegan),
    vegetarisch: Boolean(vegetarisch),
    glutenfrei: Boolean(glutenfrei),
    kategorie,
  };
  writeMenu(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const items: Array<{ id: string }> = readMenu();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }
  writeMenu(filtered);
  return NextResponse.json({ ok: true });
}
```

---

## Task 4: Auth API Route

**Files:**
- Create: `src/app/api/auth/route.ts`

- [ ] **Schritt 1: `src/app/api/auth/route.ts` erstellen**

```typescript
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const USERNAME = "123";
const PASSWORD = "123";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (username !== USERNAME || password !== PASSWORD) {
    return NextResponse.json(
      { error: "Ungültige Anmeldedaten" },
      { status: 401 }
    );
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ ok: true });
}
```

---

## Task 5: Middleware für Admin-Schutz

**Files:**
- Create: `src/middleware.ts`

- [ ] **Schritt 1: `src/middleware.ts` erstellen**

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (session?.value !== "1") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
```

---

## Task 6: Route-Gruppe `(main)` einrichten

**Files:**
- Create: `src/app/(main)/layout.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Schritt 1: `src/app/(main)/layout.tsx` erstellen**

```typescript
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Schritt 2: `src/app/layout.tsx` aktualisieren — Navigation und Footer entfernen**

Ersetze den gesamten Inhalt von `src/app/layout.tsx` mit:

```typescript
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trebelcafé Tribsees — Selbstgebackenes mit Herz",
  description:
    "Familiäres Café in Tribsees mit selbstgebackenem Kuchen, Frühstück und wechselndem Mittagstisch. Geöffnet Do–Mo 9–17 Uhr.",
  openGraph: {
    title: "Trebelcafé Tribsees",
    description: "Selbstgebackenes mit Herz — mitten in Tribsees.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}
    >
      <body className="font-dm bg-cream text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## Task 7: Öffentliche Seiten in `(main)` verschieben

**Files:**
- Create: `src/app/(main)/page.tsx` (Inhalt von `src/app/page.tsx`)
- Create: `src/app/(main)/galerie/page.tsx` (Inhalt von `src/app/galerie/page.tsx`)
- Create: `src/app/(main)/reservierung/page.tsx` (Inhalt von `src/app/reservierung/page.tsx`)
- Create: `src/app/(main)/ueber-uns/page.tsx` (Inhalt von `src/app/ueber-uns/page.tsx`)
- Create: `src/app/(main)/impressum/page.tsx` (Inhalt von `src/app/impressum/page.tsx`)
- Create: `src/app/(main)/datenschutz/page.tsx` (Inhalt von `src/app/datenschutz/page.tsx`)
- Delete: `src/app/page.tsx`, `src/app/galerie/page.tsx`, `src/app/reservierung/page.tsx`, `src/app/ueber-uns/page.tsx`, `src/app/impressum/page.tsx`, `src/app/datenschutz/page.tsx`

- [ ] **Schritt 1: Verzeichnisse anlegen und Dateien kopieren**

Für jede der folgenden Seiten: Inhalt der alten Datei in die neue `(main)/`-Variante kopieren (Inhalt bleibt identisch, nur der Pfad ändert sich):

```
src/app/page.tsx              → src/app/(main)/page.tsx
src/app/galerie/page.tsx      → src/app/(main)/galerie/page.tsx
src/app/reservierung/page.tsx → src/app/(main)/reservierung/page.tsx
src/app/ueber-uns/page.tsx    → src/app/(main)/ueber-uns/page.tsx
src/app/impressum/page.tsx    → src/app/(main)/impressum/page.tsx
src/app/datenschutz/page.tsx  → src/app/(main)/datenschutz/page.tsx
```

- [ ] **Schritt 2: Alte Dateien löschen**

Lösche die Original-Dateien (ohne den `(main)/`-Präfix), nachdem die neuen erstellt wurden:
- `src/app/page.tsx`
- `src/app/galerie/page.tsx`
- `src/app/reservierung/page.tsx`
- `src/app/ueber-uns/page.tsx`
- `src/app/impressum/page.tsx`
- `src/app/datenschutz/page.tsx`
- Leere Verzeichnisse `src/app/galerie/`, `src/app/reservierung/`, `src/app/ueber-uns/`, `src/app/impressum/`, `src/app/datenschutz/` (falls leer)

- [ ] **Schritt 3: Dev-Server prüfen**

```
npm run dev
```

Öffne http://localhost:3000 — Startseite muss mit Navigation+Footer erscheinen. Alle öffentlichen URLs (`/speisekarte`, `/galerie`, etc.) müssen weiter funktionieren.

---

## Task 8: Admin Layout

**Files:**
- Create: `src/app/admin/layout.tsx`

- [ ] **Schritt 1: `src/app/admin/layout.tsx` erstellen**

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {children}
    </div>
  );
}
```

---

## Task 9: Admin Login-Seite

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Schritt 1: `src/app/admin/page.tsx` erstellen**

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Ungültiger Benutzername oder Passwort");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl text-espresso">Trebelcafé</h1>
          <p className="font-dm text-sm text-espresso/50 mt-1">Admin-Bereich</p>
        </div>
        <div className="bg-white border border-sand rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-dm text-sm text-espresso/70 mb-1.5">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full border border-sand rounded-lg px-4 py-2.5 bg-cream text-espresso font-dm text-sm focus:outline-none focus:border-terracotta transition-colors"
              />
            </div>
            <div>
              <label className="block font-dm text-sm text-espresso/70 mb-1.5">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-sand rounded-lg px-4 py-2.5 bg-cream text-espresso font-dm text-sm focus:outline-none focus:border-terracotta transition-colors"
              />
            </div>
            {error && (
              <p className="font-dm text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white font-dm text-sm py-2.5 rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Anmelden…" : "Anmelden"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Schritt 2: Login testen**

Öffne http://localhost:3000/admin — Login-Formular muss erscheinen.
- Mit `123` / `123` einloggen → Weiterleitung zu `/admin/dashboard` (404 bis Task 10)
- Mit falschen Daten → Fehlermeldung erscheint

---

## Task 10: Admin Dashboard

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`

- [ ] **Schritt 1: `src/app/admin/dashboard/page.tsx` erstellen**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Kategorie = "wochenkarte" | "kuchenUndGebaeck" | "getraenke";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  vegan: boolean;
  vegetarisch: boolean;
  glutenfrei: boolean;
  kategorie: Kategorie;
};

type FormData = Omit<MenuItem, "id">;

const TABS: { key: Kategorie; label: string }[] = [
  { key: "wochenkarte", label: "Wochenkarte" },
  { key: "kuchenUndGebaeck", label: "Kuchen & Gebäck" },
  { key: "getraenke", label: "Getränke" },
];

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  vegan: false,
  vegetarisch: false,
  glutenfrei: false,
  kategorie: "wochenkarte",
};

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-dm px-2 py-0.5 rounded-full bg-sage/20 text-sage border border-sage/30">
      {label}
    </span>
  );
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border border-sand rounded-xl p-4 bg-white flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair text-espresso text-base truncate">{item.name}</h3>
          <p className="font-dm text-xs text-espresso/50 mt-0.5 line-clamp-2">{item.description}</p>
        </div>
        <p className="font-playfair text-terracotta text-sm font-semibold whitespace-nowrap">{item.price}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {item.vegan && <Badge label="Vegan" />}
        {item.vegetarisch && <Badge label="Vegetarisch" />}
        {item.glutenfrei && <Badge label="Glutenfrei" />}
      </div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 text-xs font-dm py-1.5 rounded-lg border border-sand hover:border-terracotta hover:text-terracotta transition-colors"
        >
          Bearbeiten
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex-1 text-xs font-dm py-1.5 rounded-lg border border-sand hover:border-red-400 hover:text-red-500 transition-colors"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

function Modal({
  form,
  editingId,
  saving,
  onChange,
  onSave,
  onClose,
  activeTab,
}: {
  form: FormData;
  editingId: string | null;
  saving: boolean;
  onChange: (form: FormData) => void;
  onSave: () => void;
  onClose: () => void;
  activeTab: Kategorie;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-sand">
          <h2 className="font-playfair text-xl text-espresso">
            {editingId ? "Gericht bearbeiten" : "Neues Gericht"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-1">Beschreibung *</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-1">Preis *</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => onChange({ ...form, price: e.target.value })}
              placeholder="z.B. 9,90 €"
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-2">Kategorie *</label>
            <select
              value={form.kategorie}
              onChange={(e) => onChange({ ...form, kategorie: e.target.value as Kategorie })}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors bg-white"
            >
              {TABS.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="font-dm text-sm text-espresso/70 mb-2">Eigenschaften</p>
            <div className="flex flex-col gap-2">
              {(["vegan", "vegetarisch", "glutenfrei"] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[flag]}
                    onChange={(e) => onChange({ ...form, [flag]: e.target.checked })}
                    className="w-4 h-4 accent-terracotta"
                  />
                  <span className="font-dm text-sm text-espresso capitalize">{flag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-sand flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 font-dm text-sm text-espresso/60 hover:text-espresso transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<Kategorie>("wochenkarte");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, kategorie: activeTab });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, kategorie: activeTab });
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      vegan: item.vegan,
      vegetarisch: item.vegetarisch,
      glutenfrei: item.glutenfrei,
      kategorie: item.kategorie,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.description.trim() || !form.price.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated: MenuItem = await res.json();
          setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        }
      } else {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const created: MenuItem = await res.json();
          setItems((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
    setDeleteConfirm(null);
  }

  function requestDelete(id: string) {
    setDeleteConfirm(id);
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
  }

  const tabItems = items.filter((i) => i.kategorie === activeTab);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-sand px-6 py-4 flex items-center justify-between">
        <h1 className="font-playfair text-xl text-espresso">Trebelcafé Admin</h1>
        <button
          onClick={handleLogout}
          className="font-dm text-sm text-espresso/50 hover:text-espresso transition-colors"
        >
          Abmelden
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-sand mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-dm text-sm px-4 py-2.5 border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-espresso/50 hover:text-espresso"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content header */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-dm text-sm text-espresso/50">
            {tabItems.length} {tabItems.length === 1 ? "Eintrag" : "Einträge"}
          </p>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors"
          >
            <span>+</span>
            <span>Neues Gericht</span>
          </button>
        </div>

        {/* Item grid */}
        {tabItems.length === 0 ? (
          <p className="font-dm text-espresso/40 text-center py-12">
            Noch keine Einträge in dieser Kategorie.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tabItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          form={form}
          editingId={editingId}
          saving={saving}
          onChange={setForm}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          activeTab={activeTab}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-playfair text-lg text-espresso mb-2">Gericht löschen?</h3>
            <p className="font-dm text-sm text-espresso/60 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 font-dm text-sm text-espresso/60 hover:text-espresso transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2 bg-red-500 text-white font-dm text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Schritt 2: Dashboard testen**

1. Öffne http://localhost:3000/admin, einloggen mit `123`/`123`
2. Alle 3 Tabs anklicken — Einträge müssen erscheinen
3. Neues Gericht erstellen → erscheint in der Liste
4. Gericht bearbeiten → Änderungen werden gespeichert
5. Gericht löschen → Bestätigungsdialog erscheint, nach Bestätigung verschwindet Eintrag
6. Abmelden → zurück zur Login-Seite
7. Direkt http://localhost:3000/admin/dashboard aufrufen ohne Login → Redirect zu `/admin`

---

## Task 11: Speisekarte mit Filter

**Files:**
- Create: `src/app/(main)/speisekarte/page.tsx` (ersetzt die alte Speisekarte)
- Delete: `src/app/speisekarte/page.tsx` (alte Version)

- [ ] **Schritt 1: Altes `src/app/speisekarte/page.tsx` löschen**

Die Datei `src/app/speisekarte/page.tsx` löschen (sie wurde in Task 7 noch NICHT in `(main)` kopiert, da sie komplett neu geschrieben wird).

- [ ] **Schritt 2: `src/app/(main)/speisekarte/page.tsx` erstellen**

```typescript
"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  vegan: boolean;
  vegetarisch: boolean;
  glutenfrei: boolean;
  kategorie: "wochenkarte" | "kuchenUndGebaeck" | "getraenke";
};

type Filter = "vegan" | "vegetarisch" | "glutenfrei";

const SECTIONS = [
  {
    key: "wochenkarte" as const,
    label: "Frisch & wechselnd",
    title: "Wochenkarte",
  },
  {
    key: "kuchenUndGebaeck" as const,
    label: "Aus unserer Backstube",
    title: "Kuchen & Gebäck",
  },
  {
    key: "getraenke" as const,
    label: "Heiß & kalt",
    title: "Getränke",
  },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "vegan", label: "Vegan" },
  { key: "vegetarisch", label: "Vegetarisch" },
  { key: "glutenfrei", label: "Glutenfrei" },
];

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-dm px-2 py-0.5 rounded-full bg-sage/15 text-sage border border-sage/25">
      {label}
    </span>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="border border-sand rounded-2xl p-6 bg-cream hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col gap-3">
      <div>
        <div className="w-6 h-px bg-terracotta mb-4 group-hover:w-12 transition-all duration-300" />
        <h3 className="font-playfair text-lg text-espresso mb-2">{item.name}</h3>
        <p className="font-dm text-sm text-espresso/60 leading-relaxed">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <p className="font-playfair text-terracotta font-semibold">{item.price}</p>
        <div className="flex gap-1 flex-wrap justify-end">
          {item.vegan && <Badge label="Vegan" />}
          {item.vegetarisch && !item.vegan && <Badge label="Vegetarisch" />}
          {item.glutenfrei && <Badge label="Glutenfrei" />}
        </div>
      </div>
    </div>
  );
}

export default function SpeisekartePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<Set<Filter>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  function toggleFilter(filter: Filter) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }

  function getFilteredItems(kategorie: MenuItem["kategorie"]) {
    const categoryItems = items.filter((i) => i.kategorie === kategorie);
    if (activeFilters.size === 0) return categoryItems;
    return categoryItems.filter((item) =>
      [...activeFilters].some((f) => item[f])
    );
  }

  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center py-16">
          <SectionLabel>Alles selbst gemacht</SectionLabel>
          <h1 className="font-playfair text-5xl md:text-6xl text-espresso mb-4">
            Speisekarte
          </h1>
          <p className="font-dm text-espresso/60 max-w-md mx-auto">
            Unsere Wochenkarte wechselt regelmäßig. Alle Gerichte werden frisch zubereitet.
          </p>
        </AnimatedSection>

        {/* Filter bar */}
        <div className="flex items-center justify-center gap-2 pb-8 flex-wrap">
          <button
            onClick={() => setActiveFilters(new Set())}
            className={`px-4 py-1.5 rounded-full font-dm text-sm transition-colors border ${
              activeFilters.size === 0
                ? "bg-terracotta text-white border-terracotta"
                : "border-sand text-espresso/60 hover:border-terracotta hover:text-terracotta"
            }`}
          >
            Alle
          </button>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`px-4 py-1.5 rounded-full font-dm text-sm transition-colors border ${
                activeFilters.has(key)
                  ? "bg-terracotta text-white border-terracotta"
                  : "border-sand text-espresso/60 hover:border-terracotta hover:text-terracotta"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="section-divider" />

        {loading ? (
          <div className="py-24 text-center font-dm text-espresso/40">Lädt…</div>
        ) : (
          SECTIONS.map((section, sectionIndex) => {
            const sectionItems = getFilteredItems(section.key);
            if (sectionItems.length === 0) return null;
            return (
              <section key={section.key}>
                <div className="py-16">
                  <AnimatedSection className="mb-10">
                    <SectionLabel>{section.label}</SectionLabel>
                    <h2 className="font-playfair text-3xl text-espresso">
                      {section.title}
                    </h2>
                    <div className="w-16 h-px bg-terracotta mt-4" />
                  </AnimatedSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionItems.map((item, i) => (
                      <AnimatedSection key={item.id} delay={i * 0.08}>
                        <MenuCard item={item} />
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
                {sectionIndex < SECTIONS.length - 1 && (
                  <div className="section-divider" />
                )}
              </section>
            );
          })
        )}

        <AnimatedSection className="py-12 text-center">
          <p className="font-cormorant italic text-xl text-espresso/60">
            Alle Preise inkl. MwSt. — Saisonale Änderungen vorbehalten.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
```

- [ ] **Schritt 3: Speisekarte testen**

1. Öffne http://localhost:3000/speisekarte
2. Alle Gerichte erscheinen in den 3 Kategorien
3. Filter "Vegan" anklicken → nur vegane Gerichte sichtbar, in ihrer jeweiligen Kategorie
4. Filter "Vegan" + "Glutenfrei" anklicken → Gerichte die mind. einen Filter erfüllen erscheinen
5. "Alle" anklicken → alle Gerichte wieder sichtbar
6. Wenn eine Kategorie nach Filterung leer ist → Kategorie-Abschnitt verschwindet

- [ ] **Schritt 4: Build-Check**

```
npm run build
```

Erwartetes Ergebnis: Build ohne Fehler abgeschlossen. Alle Seiten werden kompiliert.

---

## Abschluss-Checkliste

- [ ] `data/menu.json` existiert und enthält 15 Einträge
- [ ] `GET /api/menu` gibt alle Einträge zurück
- [ ] `POST /api/menu` erstellt neuen Eintrag (nur mit Cookie)
- [ ] `PUT /api/menu/[id]` aktualisiert Eintrag
- [ ] `DELETE /api/menu/[id]` löscht Eintrag
- [ ] Login mit `123`/`123` funktioniert, falsches Passwort zeigt Fehler
- [ ] `/admin/dashboard` ohne Login → Redirect zu `/admin`
- [ ] Alle 3 Tabs zeigen korrekte Einträge
- [ ] Erstellen, Bearbeiten, Löschen funktioniert im Dashboard
- [ ] Speisekarte lädt Daten aus API
- [ ] Filter funktionieren (OR-Logik, Mehrfachauswahl)
- [ ] Gerichte bleiben in ihrer Kategorie beim Filtern
- [ ] Leere Kategorien nach Filterung werden ausgeblendet
- [ ] `npm run build` läuft fehlerfrei durch
