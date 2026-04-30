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
): {
  nightsTotal: number;
  discountPercent: number;
  discountAmount: number;
  extraBedTotal: number;
  total: number;
} {
  const nightsTotal = nights * pricing.perNight;
  const discountPercent =
    nights >= 7 ? discounts.sevenNights : nights >= 3 ? discounts.threeNights : 0;
  const discountAmount = Math.round((nightsTotal * discountPercent) / 100 * 100) / 100;
  const discountedNights = nightsTotal - discountAmount;
  const extraBedTotal = extraBeds * pricing.extraBed;
  const total = Math.round((discountedNights + extraBedTotal + pricing.cleaningFee) * 100) / 100;
  return { nightsTotal, discountPercent, discountAmount, extraBedTotal, total };
}
