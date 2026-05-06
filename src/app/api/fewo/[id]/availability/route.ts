import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readFewo, writeFewo } from "@/lib/fewo-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

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
    const { availableDates } = body;
    if (!Array.isArray(availableDates)) {
      return NextResponse.json({ error: "availableDates muss ein Array sein" }, { status: 400 });
    }
    const data = await readFewo();
    const index = data.apartments.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    data.apartments[index].availableDates = availableDates;
    await writeFewo(data);
    revalidatePath("/ferienwohnungen", "layout");
    return NextResponse.json({ ok: true, availableDates });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
