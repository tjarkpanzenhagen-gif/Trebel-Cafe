import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readMenu, writeMenu } from "@/lib/menu-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

export async function GET() {
  try {
    const items = await readMenu();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, description, price, vegan, vegetarisch, glutenfrei, kategorie } = body;
    if (!name || !description || !price || !kategorie) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    const items = await readMenu();
    const newItem = {
      id: randomUUID(),
      name,
      description,
      price,
      vegan: Boolean(vegan),
      vegetarisch: Boolean(vegetarisch),
      glutenfrei: Boolean(glutenfrei),
      kategorie,
    };
    items.push(newItem);
    await writeMenu(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
