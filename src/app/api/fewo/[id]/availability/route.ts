import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readFewo, writeFewo } from "@/lib/fewo-store";
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
    const { blockedDates, global: isGlobal } = body as {
      blockedDates: unknown;
      global?: boolean;
    };
    if (!Array.isArray(blockedDates)) {
      return NextResponse.json({ error: "blockedDates muss ein Array sein" }, { status: 400 });
    }
    const dates = (blockedDates as unknown[])
      .filter((d): d is string => typeof d === "string")
      .map((d) => d.slice(0, 10));

    const data = await readFewo();

    if (isGlobal) {
      data.globalBlockedDates = dates;
    } else {
      const index = data.apartments.findIndex((a) => a.id === id);
      if (index === -1) {
        return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
      }
      data.apartments[index].blockedDates = dates;
    }

    await writeFewo(data);
    revalidatePath("/ferienwohnungen", "layout");
    return NextResponse.json({ ok: true, blockedDates: dates });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
