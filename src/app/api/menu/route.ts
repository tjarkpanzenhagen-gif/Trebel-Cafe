import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

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

export async function GET() {
  try {
    const items = readMenu();
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
    const items = readMenu();
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
    writeMenu(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
