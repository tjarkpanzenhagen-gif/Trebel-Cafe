import { NextRequest, NextResponse } from "next/server";
import { readMenu, writeMenu, MENU_KATEGORIEN } from "@/lib/menu-store";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, vegan, vegetarisch, glutenfrei, kategorie } = body;
    if (!name || !description || !price || !kategorie) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    if (!(MENU_KATEGORIEN as readonly string[]).includes(String(kategorie))) {
      return NextResponse.json({ error: "Ungültige Kategorie" }, { status: 400 });
    }
    const items = await readMenu();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    items[index] = { ...items[index], name, description, price, vegan: Boolean(vegan), vegetarisch: Boolean(vegetarisch), glutenfrei: Boolean(glutenfrei), kategorie };
    await writeMenu(items);
    return NextResponse.json(items[index]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const items = await readMenu();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    await writeMenu(filtered);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
