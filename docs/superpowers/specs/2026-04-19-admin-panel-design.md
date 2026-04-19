# Admin Panel & Speisekarten-Filter — Design Spec

**Datum:** 2026-04-19  
**Projekt:** Trebelcafé Tribsees (Next.js 16)

---

## Ziel

Ein passwortgeschütztes Admin-Panel, über das die Betreiber Speisekartendaten pflegen können (erstellen, bearbeiten, löschen). Gerichte erhalten Diät-Flags (vegan, vegetarisch, glutenfrei). Auf der öffentlichen Speisekarte können Besucher danach filtern.

---

## Datenschicht

### `data/menu.json`

Zentrale Datendatei auf dem Server. Ersetzt die statischen Menü-Arrays in `src/lib/content.ts` (die nicht-Menü-Daten wie `contact`, `hours`, `promises` etc. bleiben in `content.ts`).

**Schema pro Eintrag:**
```json
{
  "id": "uuid-v4",
  "name": "string",
  "description": "string",
  "price": "string",
  "vegan": false,
  "vegetarisch": false,
  "glutenfrei": false,
  "kategorie": "wochenkarte" | "kuchenUndGebaeck" | "getraenke"
}
```

**Initiale Daten:** Die bestehenden Einträge aus `content.ts` (`fullMenu`) werden mit `vegan/vegetarisch/glutenfrei: false` migriert.

---

## Architektur

### Route-Gruppen

```
src/app/
  (main)/                   ← öffentliche Seiten (mit Navigation + Footer)
    layout.tsx              ← enthält <Navigation> und <Footer>
    page.tsx
    speisekarte/page.tsx
    galerie/page.tsx
    reservierung/page.tsx
    ueber-uns/page.tsx
    impressum/page.tsx
    datenschutz/page.tsx
  admin/
    layout.tsx              ← minimales Layout ohne Navigation/Footer
    page.tsx                ← Login-Seite
    dashboard/
      page.tsx              ← Admin-Dashboard
  api/
    auth/
      route.ts              ← POST /api/auth (login), DELETE /api/auth (logout)
    menu/
      route.ts              ← GET, POST /api/menu
      [id]/
        route.ts            ← PUT, DELETE /api/menu/[id]
```

Die Root-`layout.tsx` wird minimal (nur html/body + Fonts). Navigation und Footer wandern in `(main)/layout.tsx`.

---

## Authentifizierung

- Credentials: Benutzername `123`, Passwort `123` (serverseitig hardcodiert)
- Bei erfolgreichem Login: HttpOnly-Cookie `admin_session=1` (keine echte Signatur nötig für diesen Zweck)
- Middleware oder Layout-Check: `/admin/dashboard` prüft Cookie — ohne gültiges Cookie Redirect zu `/admin`
- Logout: Cookie löschen, Redirect zu `/admin`

---

## Admin-Panel UI

### Login (`/admin`)

- Zentriertes Formular im Café-Stil (cream/espresso/terracotta)
- Felder: Benutzername, Passwort
- Fehlertext bei falschen Credentials
- Weiterleitung zu `/admin/dashboard` bei Erfolg

### Dashboard (`/admin/dashboard`)

- Header: "Trebelcafé Admin" + Logout-Button (rechts)
- Drei Tabs: **Wochenkarte** | **Kuchen & Gebäck** | **Getränke**
- Pro Tab:
  - "+ Neues Gericht" Button oben rechts
  - Liste der Gerichte als Karten (Name, Beschreibung, Preis, Diät-Badges)
  - Pro Karte: Bearbeiten-Button, Löschen-Button (mit Bestätigungsdialog)

### Modal: Erstellen / Bearbeiten

Felder:
- Name (Pflicht)
- Beschreibung (Pflicht)
- Preis (Pflicht, z.B. "9,90 €")
- Checkboxen: Vegan, Vegetarisch, Glutenfrei

Aktionen: Abbrechen | Speichern

---

## Speisekarte (öffentlich)

- Liest Daten aus `GET /api/menu` (statt aus `content.ts`)
- Wird zu einem **Client Component** für interaktive Filterung
- Filter-Leiste unter dem Seitentitel: `Alle | Vegan | Vegetarisch | Glutenfrei`
  - Mehrfachauswahl möglich (OR-Logik: Gericht wird angezeigt, wenn es mind. einen der aktiven Filter erfüllt)
  - Aktiver Filter: terracotta-Hintergrund
- Gerichte bleiben in ihren Kategorien
- Kategorie wird ausgeblendet, wenn nach dem Filtern keine Einträge übrig bleiben
- Diät-Badges auf jeder Gerichtskarte (nur wenn Flag gesetzt)

---

## API Routes

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| POST | `/api/auth` | Login — setzt Cookie |
| DELETE | `/api/auth` | Logout — löscht Cookie |
| GET | `/api/menu` | Alle Einträge zurückgeben |
| POST | `/api/menu` | Neuen Eintrag erstellen |
| PUT | `/api/menu/[id]` | Eintrag aktualisieren |
| DELETE | `/api/menu/[id]` | Eintrag löschen |

Alle schreibenden Endpoints prüfen das Session-Cookie. Ohne gültiges Cookie: 401.

---

## Nicht im Scope

- Bildupload für Gerichte
- Mehrere Admin-Benutzer / Rollen
- Änderungshistorie
- Backup/Export der JSON-Datei
