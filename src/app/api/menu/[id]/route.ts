import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "menu.json");

function readMenu() {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeMenu(data: unknown) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function isAuthenticated(request: NextRequest) {
  return request.cookies.get("admin_session")?.value === "1";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const { name, description, price, vegan, vegetarisch, glutenfrei, kategorie } = body;
  if (!name || !description || !price || !kategorie) {
    return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
  }
  const items: Array<{ id: string; [key: string]: unknown }> = readMenu();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }
  items[index] = {
    id,
    name,
    description,
    price,
    vegan: Boolean(vegan),
    vegetarisch: Boolean(vegetarisch),
    glutenfrei: Boolean(glutenfrei),
    kategorie,
  };
  writeMenu(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const items: Array<{ id: string }> = readMenu();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }
  writeMenu(filtered);
  return NextResponse.json({ ok: true });
}
