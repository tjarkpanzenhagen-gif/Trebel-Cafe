import { readFewo } from "@/lib/fewo-store";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const fewoData = await readFewo();
  return <AdminDashboardClient initialFewoApartments={fewoData.apartments} />;
}
