import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readFewo } from "@/lib/fewo-store";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  if (!verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect("/admin");
  }

  const fewoData = await readFewo();
  return (
    <AdminDashboardClient
      initialFewoApartments={fewoData.apartments}
      initialGlobalBlockedDates={fewoData.globalBlockedDates ?? []}
    />
  );
}
