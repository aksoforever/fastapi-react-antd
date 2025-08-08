import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "@/features/admin/AdminPage";

export const Route = createFileRoute("/_layout/admin")({
  component: AdminPage,
});
