# Ferienwohnungen — Design Spec
**Datum:** 2026-04-30
**Projekt:** Trebelcafé Website
**Status:** Genehmigt

---

## Überblick

Erweiterung der Trebelcafé-Website um eine Ferienwohnungs-Buchungsseite. Zwei Wohnungen mit eigenen Namen können per E-Mail-Anfrage gebucht werden. Preise, Verfügbarkeit und Rabatte sind im Admin-Panel verwaltbar.

---

## Architektur

**Ansatz:** JSON-basierte Datenhaltung (konsistent mit bestehendem `data/menu.json`)

- Neue Datei `data/fewo.json` speichert alle Ferienwohnungsdaten
- Neue API-Routen unter `/api/fewo/` (analog zu `/api/menu/`)
- Neue öffentliche Route `/ferienwohnungen` + Unterseiten `/ferienwohnungen/[slug]`
- Neuer "FeWo"-Tab im bestehenden Admin-Dashboard (`/admin/dashboard`)
- Buchungsanfrage per `mailto:` (kein Payment-System)

---

## Datenstruktur (`data/fewo.json`)

```json
{
  "apartments": [
    {
      "id": "wohnung-1",
      "slug": "wohnung-1",
      "name": "[Name Wohnung 1]",
      "description": "Kurze Beschreibung der Wohnung",
      "details": "Längere Beschreibung für die Detailseite",
      "maxPersons": 3,
      "sizeSqm": 0,
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
      "name": "[Name Wohnung 2]",
      "description": "Kurze Beschreibung der Wohnung",
      "details": "Längere Beschreibung für die Detailseite",
      "maxPersons": 4,
      "sizeSqm": 0,
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
    }
  ]
}
```

`blockedDates` ist ein Array von ISO-Datumsstrings (`"2026-05-03"`). Alle Tage, die nicht in `blockedDates` stehen, gelten als verfügbar.

---

## API-Routen

| Route | Methode | Auth | Beschreibung |
|---|---|---|---|
| `/api/fewo` | GET | Nein | Alle Wohnungsdaten lesen |
| `/api/fewo/[id]` | PUT | Ja | Preise, Rabatte, Name, Beschreibung updaten |
| `/api/fewo/[id]/availability` | PUT | Ja | `blockedDates` setzen |

Auth = bestehende `admin_session` Cookie-Prüfung.

---

## Öffentliche Seiten

### `/ferienwohnungen` — Übersichtsseite

**Aufbau (von oben nach unten, scrollbar):**
1. **Hero** — Terracotta-Hintergrund, Titel "Ferienwohnungen im Trebelcafé", Kurztext
2. **Wohnung 1** — Bildergalerie (Grid: 1 Hauptbild + 3 kleinere), Name, Kurzbeschreibung, Preistabelle mit Rabatten, "Zum Angebot →"-Button
3. **Wohnung 2** — identischer Aufbau
4. **Essen inklusive** — zeigt automatisch die aktuellen Wochenangebote aus der Speisekarte (bestehende Menü-API)

**Preistabelle je Wohnung (auf Übersichtsseite sichtbar):**
- Preis / Nacht: XX €
- Aufbettung: XX € / Person
- Endreinigung: XX €
- Rabatt ab 3 Nächten: X%
- Rabatt ab 7 Nächten: X%

**Bilder:** Vorerst Placeholder-Divs in den Farben des Design-Systems. Echte Bilder werden nachgereicht und in `public/fewo/` gespeichert.

---

### `/ferienwohnungen/[slug]` — Detailseite

**Aufbau:**
1. **Header** — dunkler Hintergrund (`espresso`), Wohnungsname, "← Zurück zur Übersicht"-Link
2. **Bildergalerie** — Vollbreite, mehrere Bilder (Placeholder vorerst)
3. **Beschreibung & Ausstattung** — Langtext, Merkmale
4. **Preistabelle** — identisch zur Übersichtsseite, aber größer dargestellt
5. **Verfügbarkeitskalender** — React Day Picker (bereits im Projekt), zeigt belegte Tage in Terracotta, freie Tage in Sage/Grün. Nur zur Ansicht, nicht interaktiv buchbar über den Kalender direkt.
6. **Buchungsanfrage-Formular** — Felder:
   - An- und Abreisedatum (zwei Date-Inputs) — belegte Tage können nicht gewählt werden, Validierung gegen `blockedDates`
   - Name (Pflichtfeld)
   - E-Mail (Pflichtfeld)
   - Telefon (Pflichtfeld)
   - Anzahl Personen
   - Aufbettung gewünscht (Ja/Nein + Anzahl)
   - Nachricht (optional)
   - **Live-Preisberechnung** (sichtbar über dem Submit-Button):
     - Nächte × Preis/Nacht = Subtotal
     - Rabatt wird automatisch angewendet (−X% ab 3 Nächten, −X% ab 7 Nächten)
     - + Aufbettung (falls gewählt)
     - + Endreinigung
     - = **Gesamtpreis**
   - Submit → `mailto:trebelcafe@gmx.de` mit allen Feldern im Body
7. **Essen inklusive** — Wochenangebote (wie auf Übersichtsseite)

---

## Rabatt-Logik

```
nights = Abreisedatum - Anreisedatum (in Tagen)

if nights >= 7:
  discount = discounts.sevenNights / 100
elif nights >= 3:
  discount = discounts.threeNights / 100
else:
  discount = 0

nightsTotal = nights × pricing.perNight
discountedNights = nightsTotal × (1 - discount)
extraBedTotal = extraBeds × pricing.extraBed
total = discountedNights + extraBedTotal + pricing.cleaningFee
```

Rabatt wird nur auf den Nachtpreis angewendet, nicht auf Aufbettung oder Endreinigung.

---

## Admin Panel — FeWo Tab

### Einbindung
Neuer Tab "🏠 Ferienwohnungen" in der bestehenden Tab-Leiste des Admin-Dashboards, neben "Wochenkarte", "Kuchen & Gebäck", "Getränke".

### Aufbau
- **Sub-Tabs** je Wohnung (Wohnung 1 / Wohnung 2)
- Pro Wohnung: **zwei Spalten**

**Linke Spalte — Verfügbarkeit:**
- Klickbarer Monatskalender (React Day Picker, Multi-Select)
- Tage anklicken → togglet zwischen frei (Sage) und belegt (Terracotta)
- Buttons: "Zeitraum blockieren" und "Zeitraum freigeben" (Range-Auswahl)
- Monat vorwärts/rückwärts navigierbar
- Eigener "Verfügbarkeit speichern"-Button → PUT `/api/fewo/[id]/availability`

**Rechte Spalte — Preise & Rabatte:**
- Input: Preis pro Nacht (€)
- Input: Aufbettung pro Person (€)
- Input: Endreinigung (€)
- Input: Rabatt ab 3 Nächten (%)
- Input: Rabatt ab 7 Nächten (%)
- Button: "Änderungen speichern" → PUT `/api/fewo/[id]`

---

## Navigation

Neuer Nav-Eintrag "Ferienwohnungen" in der bestehenden Navigation. Position: nach "Über uns", vor "Galerie".

---

## Technische Details

- **Storage:** `data/fewo.json`, gelesen/geschrieben via `lib/fewo-store.ts` (analog zu `lib/menu-store.ts`)
- **Kalender-Komponente:** `react-day-picker` (bereits in `package.json`)
- **Bilder:** Vorerst Placeholder-Komponente, später `public/fewo/wohnung-1/` etc. via Next.js `<Image>`
- **Animationen:** Bestehende `AnimatedSection`-Komponente für Scroll-Fade-Ins
- **Design-Token:** Alle bestehenden CSS-Variablen (cream, espresso, terracotta, sand, sage)
- **Fonts:** Playfair Display für Headlines, DM Sans für Body (wie überall)

---

## Out of Scope

- Online-Zahlung / Payment-Integration
- Gäste-Accounts / Login
- Automatische Buchungsbestätigung per E-Mail (nur mailto)
- iCal-Export / Kalender-Synchronisation
- Mehrsprachigkeit
