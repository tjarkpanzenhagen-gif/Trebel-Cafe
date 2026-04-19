export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  vegan: boolean;
  vegetarisch: boolean;
  glutenfrei: boolean;
  kategorie: "wochenkarte" | "kuchenUndGebaeck" | "getraenke";
};

const KV_KEY = "trebelcafe_menu";

export const INITIAL_MENU: MenuItem[] = [
  { id: "1", name: "Käse-Schinken-Salat", description: "Frischer Salat mit würzigem Käse und feinem Schinken", price: "9,90 €", vegan: false, vegetarisch: false, glutenfrei: true, kategorie: "wochenkarte" },
  { id: "2", name: "Ofenkartoffel mit Quark", description: "Knusprige Ofenkartoffel mit hausgemachtem Kräuterquark", price: "10,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "wochenkarte" },
  { id: "3", name: "Kartoffelpuffer mit Fisch", description: "Goldbraune Kartoffelpuffer mit Räucherfischfilet", price: "13,90 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "wochenkarte" },
  { id: "4", name: "Ziegenkäse-Salat", description: "Gemischter Salat mit warmem Ziegenkäse und Walnüssen", price: "12,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "wochenkarte" },
  { id: "5", name: "Bauerfrühstück", description: "Herzhaftes Frühstück mit Ei, Speck und frischem Brot", price: "16,50 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "wochenkarte" },
  { id: "6", name: "Hausgemachter Kuchen des Tages", description: "Täglich wechselnd, alles selbst gebacken", price: "3,50 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "kuchenUndGebaeck" },
  { id: "7", name: "Käsekuchen", description: "Cremig und leicht, nach Familienrezept", price: "3,80 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "kuchenUndGebaeck" },
  { id: "8", name: "Streuselkuchen", description: "Buttrig-knuspriger Streuselkuchen vom Blech", price: "3,50 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "kuchenUndGebaeck" },
  { id: "9", name: "Brot & Brötchen", description: "Frisch gebacken, täglich", price: "ab 1,20 €", vegan: true, vegetarisch: true, glutenfrei: false, kategorie: "kuchenUndGebaeck" },
  { id: "10", name: "Filterkaffee", description: "Frisch gebrüht", price: "2,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "getraenke" },
  { id: "11", name: "Cappuccino", description: "Mit cremigem Milchschaum", price: "3,20 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "getraenke" },
  { id: "12", name: "Latte Macchiato", description: "Groß und samtig", price: "3,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "getraenke" },
  { id: "13", name: "Tee (Kanne)", description: "Auswahl an Sorten", price: "3,00 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "getraenke" },
  { id: "14", name: "Hausgemachte Limonade", description: "Zitrone-Minze oder Holunder", price: "3,80 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "getraenke" },
  { id: "15", name: "Kuchen & Kaffee (Set)", description: "Ein Stück Kuchen + Filterkaffee", price: "6,50 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "getraenke" },
];

function hasKVCredentials() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function readMenu(): Promise<MenuItem[]> {
  if (hasKVCredentials()) {
    try {
      const { kv } = await import("@vercel/kv");
      const items = await kv.get<MenuItem[]>(KV_KEY);
      if (!items) {
        await kv.set(KV_KEY, INITIAL_MENU);
        return INITIAL_MENU;
      }
      return items;
    } catch {
      return INITIAL_MENU;
    }
  }
  if (!process.env.VERCEL) {
    // local file system
    const { readFileSync } = await import("fs");
    const { join } = await import("path");
    try {
      return JSON.parse(readFileSync(join(process.cwd(), "data", "menu.json"), "utf-8"));
    } catch {
      return INITIAL_MENU;
    }
  }
  return INITIAL_MENU;
}

export async function writeMenu(items: MenuItem[]): Promise<void> {
  if (hasKVCredentials()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, items);
    return;
  }
  if (!process.env.VERCEL) {
    const { writeFileSync } = await import("fs");
    const { join } = await import("path");
    writeFileSync(join(process.cwd(), "data", "menu.json"), JSON.stringify(items, null, 2));
    return;
  }
  throw new Error("KV_REST_API_URL und KV_REST_API_TOKEN fehlen in den Vercel Env-Variablen.");
}
