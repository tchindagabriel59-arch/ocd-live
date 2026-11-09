import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Console Bovant",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  // Le hint démo n'apparaît que si aucun ADMIN_CODE n'est configuré.
  return <AdminApp demoHint={!process.env.ADMIN_CODE} />;
}
