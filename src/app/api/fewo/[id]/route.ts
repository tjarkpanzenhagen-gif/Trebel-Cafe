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
    const { name, description, details, maxPersons, pricing, discounts } = body;
    if (!name || pricing?.perNight == null || !discounts) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    const data = await readFewo();
    const index = data.apartments.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    data.apartments[index] = {
      ...data.apartments[index],
      name,
      description,
      details,
      maxPersons: Number(maxPersons) || data.apartments[index].maxPersons,
      pricing: {
        perNight: Number(pricing.perNight) || 0,
        kinderbettFee: Number(pricing.kinderbettFee ?? 15) || 0,
        aufbettungFee: Number(pricing.aufbettungFee ?? 0) || 0,
        cleaningFee: Number(pricing.cleaningFee) || 0,
      },
      discounts: {
        threeNights: Number(discounts.threeNights) || 0,
        sevenNights: Number(discounts.sevenNights) || 0,
      },
    };
    await writeFewo(data);
    revalidatePath("/ferienwohnungen", "layout");
    return NextResponse.json(data.apartments[index]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
