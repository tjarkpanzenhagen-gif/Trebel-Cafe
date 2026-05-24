import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readFewo } from "@/lib/fewo-store";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  if (!session || session.value !== secret) {
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
