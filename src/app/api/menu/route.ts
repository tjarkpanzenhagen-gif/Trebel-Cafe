import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readMenu, writeMenu, MENU_KATEGORIEN } from "@/lib/menu-store";
import { isAuthenticated } from "@/lib/auth";

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
    if (!(MENU_KATEGORIEN as readonly string[]).includes(String(kategorie))) {
      return NextResponse.json({ error: "Ungültige Kategorie" }, { status: 400 });
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
