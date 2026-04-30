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
