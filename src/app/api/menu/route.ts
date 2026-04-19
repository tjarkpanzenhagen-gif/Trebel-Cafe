import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";

const DATA_PATH = join(process.cwd(), "data", "menu.json");

function readMenu() {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeMenu(data: unknown) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "1";
}

export async function GET() {
  const items = readMenu();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, description, price, vegan, vegetarisch, glutenfrei, kategorie } = body;
  if (!name || !description || !price || !kategorie) {
    return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
  }
  const items = readMenu();
  const newItem = {
    id: crypto.randomUUID(),
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
}
