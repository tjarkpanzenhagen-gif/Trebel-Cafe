export type {
  ApartmentPricing,
  ApartmentDiscounts,
  Apartment,
  FewoData,
} from "@/lib/fewo-utils";
export { calculatePrice } from "@/lib/fewo-utils";

import type { FewoData } from "@/lib/fewo-utils";

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

// Aufbettung defaults per apartment — only applied when migrating from old schema
// that had no aufbettungFee field (only extraBed). Once admin saves pricing via
// the panel the new values are persisted and these defaults are never used again.
const AUFBETTUNG_DEFAULTS: Record<string, number> = {
  "wohnung-2": 15,
};

function migrate(data: FewoData): FewoData {
  const raw = data as unknown as Record<string, unknown>;
  return {
    globalBlockedDates: Array.isArray(raw["globalBlockedDates"])
      ? (raw["globalBlockedDates"] as string[])
      : [],
    apartments: data.apartments.map((apt) => {
      const rawApt = apt as unknown as Record<string, unknown>;
      const rawPricing = (rawApt["pricing"] ?? {}) as Record<string, unknown>;
      const rawDiscounts = (rawApt["discounts"] ?? {}) as Record<string, unknown>;
      const aptId = String(rawApt["id"] ?? "");
      // Old schema used "extraBed" and had no aufbettungFee — detect and use defaults
      const isOldSchema = "extraBed" in rawPricing && !("aufbettungFee" in rawPricing);
      return {
        ...apt,
        blockedDates: Array.isArray(rawApt["blockedDates"])
          ? (rawApt["blockedDates"] as string[])
          : [],
        pricing: {
          perNight: Number(rawPricing["perNight"]) || 0,
          kinderbettFee: Number(rawPricing["kinderbettFee"] ?? rawPricing["extraBed"]) || 0,
          aufbettungFee: isOldSchema
            ? (AUFBETTUNG_DEFAULTS[aptId] ?? 0)
            : Number(rawPricing["aufbettungFee"]) || 0,
          cleaningFee: Number(rawPricing["cleaningFee"]) || 0,
        },
        discounts: {
          threeNights: Number(rawDiscounts["threeNights"]) || 0,
          sevenNights: Number(rawDiscounts["sevenNights"]) || 0,
        },
      };
    }),
  };
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
      const migrated = migrate(data);
      // Self-heal: fewo.json is authoritative for whether an apartment has
      // Aufbettung (0 = no, >0 = yes). Correct KV if the rule is violated.
      const defaults = await getInitialData();
      let healed = false;
      for (const apt of migrated.apartments) {
        const def = defaults.apartments.find((a) => a.id === apt.id);
        if (!def) continue;
        const shouldHave = def.pricing.aufbettungFee > 0;
        const hasIt = apt.pricing.aufbettungFee > 0;
        if (shouldHave !== hasIt) {
          apt.pricing.aufbettungFee = shouldHave ? def.pricing.aufbettungFee : 0;
          healed = true;
        }
        if (apt.maxPersons !== def.maxPersons) {
          apt.maxPersons = def.maxPersons;
          healed = true;
        }
        if (apt.images.length === 0 && def.images.length > 0) {
          apt.images = def.images;
          healed = true;
        }
      }
      if (healed) await kv.set(KV_KEY, migrated);
      return migrated;
    } catch {
      return getInitialData();
    }
  }
  if (!process.env.VERCEL) {
    const { readFileSync } = await import("fs");
    const { join } = await import("path");
    try {
      return migrate(JSON.parse(readFileSync(join(process.cwd(), "data", "fewo.json"), "utf-8")));
    } catch {
      return getInitialData();
    }
  }
  return migrate(await getInitialData());
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
