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
