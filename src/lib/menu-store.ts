export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  vegan: boolean;
  vegetarisch: boolean;
  glutenfrei: boolean;
  kategorie: "wochenkarte" | "kuchenUndGebaeck" | "fruehstueck" | "fruehstueckExtras" | "mittagskarte" | "wein" | "heissgetraenke" | "softgetraenke" | "bier" | "eisKaltgetraenke";
};

const KV_KEY = "trebelcafe_menu_v3";

export const INITIAL_MENU: MenuItem[] = [
  // Frühstück
  { id: "f1", name: "Kleines Frühstück", description: "1 Brötchen, Butter, Wurst oder Käse, Konfitüre, 1 Glas Orangensaft, Kaffee oder Tee", price: "11,90 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f2", name: "Kinder-Frühstück", description: "bis 10 Jahre · 1 Brötchen, Butter, Nutella oder Konfitüre, 1 Tasse Kakao", price: "7,90 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f3", name: "Großes Frühstück", description: "auch nur mit Käse oder Wurst möglich · 2 Brötchen, Brot, Butter, Wurst, Käse, Konfitüre, Honig, Quark, 1 Glas Orangensaft, Kaffee oder Tee", price: "20,50 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f4", name: "Frühstück für Zwei", description: "4 Brötchen, Brot, Butter, Wurst, Käse, Konfitüre, Quark, Honig, Lachs, Kaffee oder Tee, 2 Glas Orangensaft, 2 Glas Sekt", price: "41,90 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f5", name: "Halbes belegtes Brötchen – Käse/Salami", description: "", price: "2,90 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f6", name: "Halbes belegtes Brötchen – Roher Schinken", description: "", price: "3,20 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f7", name: "Halbes belegtes Brötchen – Lachs", description: "", price: "4,90 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "fruehstueck" },
  { id: "f8", name: "Halbes belegtes Brötchen – Rührei", description: "", price: "4,50 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueck" },
  // Frühstücksextras
  { id: "fe1", name: "Gekochtes Ei", description: "", price: "1,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "fruehstueckExtras" },
  { id: "fe2", name: "Butter", description: "", price: "0,90 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "fruehstueckExtras" },
  { id: "fe3", name: "Spiegelei", description: "", price: "2,00 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "fruehstueckExtras" },
  { id: "fe4", name: "Portion Rührei", description: "", price: "3,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "fruehstueckExtras" },
  { id: "fe5", name: "Brötchen", description: "", price: "2,00 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueckExtras" },
  { id: "fe6", name: "Scheibe Brot", description: "", price: "1,40 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "fruehstueckExtras" },
  { id: "fe7", name: "Portion Speck", description: "", price: "4,40 €", vegan: false, vegetarisch: false, glutenfrei: true, kategorie: "fruehstueckExtras" },
  { id: "fe8", name: "Honig/Fruchtaufstrich", description: "", price: "2,60 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "fruehstueckExtras" },
  { id: "fe9", name: "Portion Lachs mit Sahnemeerrettich", description: "", price: "5,80 €", vegan: false, vegetarisch: false, glutenfrei: true, kategorie: "fruehstueckExtras" },
  // Mittagskarte
  { id: "m1", name: "Belegtes Brot mit Käse", description: "", price: "6,20 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "mittagskarte" },
  { id: "m2", name: "Belegtes Brot mit rohem Schinken", description: "", price: "6,90 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "mittagskarte" },
  { id: "m3", name: "Belegtes Brot mit Salami", description: "", price: "6,20 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "mittagskarte" },
  { id: "m4", name: "Strammer Max", description: "Roher Schinken, Brot, Spiegelei", price: "9,90 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "mittagskarte" },
  { id: "m5", name: "Strammer Moritz", description: "Salami, Brot, Spiegelei", price: "8,90 €", vegan: false, vegetarisch: false, glutenfrei: false, kategorie: "mittagskarte" },
  { id: "m6", name: "Stramme Susi", description: "Käse, Brot, Spiegelei", price: "8,90 €", vegan: false, vegetarisch: true, glutenfrei: false, kategorie: "mittagskarte" },
  { id: "m7", name: "Kleiner Salat", description: "Verschiedene Salat- und Gemüsesorten mit Honig-Senf-Dressing", price: "5,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "mittagskarte" },
  { id: "m8", name: "Großer Salat", description: "Verschiedene Salat- und Gemüsesorten mit Honig-Senf-Dressing", price: "9,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "mittagskarte" },
  // Wein
  { id: "w1", name: "Schwarzriesling", description: "0,25l", price: "6,60 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "wein" },
  { id: "w2", name: "Rêve de Rosé", description: "0,25l", price: "6,60 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "wein" },
  { id: "w3", name: "Blanc de Noirs trocken", description: "0,25l", price: "6,60 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "wein" },
  { id: "w4", name: "Piccolo Sekt", description: "0,2l", price: "7,60 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "wein" },
  // Heißgetränke
  { id: "h1", name: "Glas Tee", description: "", price: "3,70 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h2", name: "Tasse Kaffee Crema", description: "", price: "2,60 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h3", name: "Pott Kaffee Crema", description: "", price: "4,90 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h4", name: "French Press Kaffee", description: "", price: "4,20 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h5", name: "Cappuccino", description: "", price: "3,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h6", name: "Milchkaffee", description: "", price: "4,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h7", name: "Latte Macchiato", description: "", price: "4,90 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h8", name: "Espresso", description: "", price: "2,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h9", name: "Espresso Macchiato", description: "", price: "2,80 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h10", name: "Heiße Schokolade mit Sahnehaube", description: "", price: "5,30 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h11", name: "Heiße weiße Schokolade mit Sahnehaube", description: "", price: "5,30 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h12", name: "Chococcio", description: "auch in weiß", price: "6,30 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h13", name: "Lumumba", description: "Heiße Schokolade mit Rum und Sahnehaube", price: "6,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h14", name: "Baileys Chocolate", description: "Heiße weiße Schokolade mit Baileys und Sahnehaube", price: "6,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h15", name: "Grog", description: "Wasser mit Rum und Zucker", price: "3,90 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  { id: "h16", name: "Hüttentee 50% vol.", description: "", price: "4,90 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "heissgetraenke" },
  // Softgetränke
  { id: "s1", name: "Wasser raus/still", description: "0,33l", price: "2,60 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s2", name: "Apfelsaft", description: "0,33l", price: "2,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s3", name: "Orangensaft", description: "0,33l", price: "2,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s4", name: "Multivitaminsaft", description: "0,33l", price: "2,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s5", name: "Sanddornsaft", description: "0,33l", price: "2,50 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s6", name: "Saftschorle", description: "0,5l", price: "4,90 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s7", name: "Fritz Kola", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s8", name: "Fritz Super Zero", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s9", name: "Fritz Orange Limo", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s10", name: "Fritz Zitronen Limo", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s11", name: "Fritz Misch Masch", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s12", name: "Fritz Traubenschorle", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s13", name: "Fritz Ingwer-Limette", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  { id: "s14", name: "Fritz Rhabarber Spritz", description: "0,33l", price: "3,40 €", vegan: true, vegetarisch: true, glutenfrei: true, kategorie: "softgetraenke" },
  // Bier
  { id: "b1", name: "Störtebecker Pils", description: "0,33l", price: "3,70 €", vegan: true, vegetarisch: true, glutenfrei: false, kategorie: "bier" },
  { id: "b2", name: "Störtebecker alkoholfrei", description: "0,33l", price: "3,70 €", vegan: true, vegetarisch: true, glutenfrei: false, kategorie: "bier" },
  { id: "b3", name: "Störtebecker Radler", description: "0,5l", price: "4,50 €", vegan: true, vegetarisch: true, glutenfrei: false, kategorie: "bier" },
  { id: "b4", name: "Hefeweizen", description: "0,5l", price: "4,90 €", vegan: true, vegetarisch: true, glutenfrei: false, kategorie: "bier" },
  { id: "b5", name: "Hefeweizen alkoholfrei", description: "0,5l", price: "4,90 €", vegan: true, vegetarisch: true, glutenfrei: false, kategorie: "bier" },
  // Eis-Kaltgetränke
  { id: "e1", name: "Sanfter Engel", description: "Orangensaft, Rum, Vanilleeis", price: "6,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "eisKaltgetraenke" },
  { id: "e2", name: "Sanfter Engel light", description: "Orangensaft, Vanilleeis", price: "4,90 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "eisKaltgetraenke" },
  { id: "e3", name: "Eisschokolade", description: "Kakao, Vanilleeis, Sahne", price: "5,70 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "eisKaltgetraenke" },
  { id: "e4", name: "Eiskaffee", description: "Kaffee, Vanilleeis, Sahne", price: "5,70 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "eisKaltgetraenke" },
  { id: "e5", name: "Affogato al Caffè", description: "Espresso, Vanilleeis", price: "4,50 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "eisKaltgetraenke" },
  { id: "e6", name: "Ice Latte", description: "Espresso, kalter Milchschaum, Vanilleeis", price: "5,90 €", vegan: false, vegetarisch: true, glutenfrei: true, kategorie: "eisKaltgetraenke" },
];

const KV_URL = process.env.trebelcafe_KV_REST_API_URL;
const KV_TOKEN = process.env.trebelcafe_KV_REST_API_TOKEN;

function hasKVCredentials() {
  return Boolean(KV_URL && KV_TOKEN);
}

async function getKV() {
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: KV_URL!, token: KV_TOKEN! });
}

export async function readMenu(): Promise<MenuItem[]> {
  if (hasKVCredentials()) {
    try {
      const kv = await getKV();
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
    const kv = await getKV();
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
