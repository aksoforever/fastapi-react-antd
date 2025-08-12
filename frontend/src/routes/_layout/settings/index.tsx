import { createFileRoute } from "@tanstack/react-router";
import UserSettingsPage from "@/features/userSettings/UserSettingsPage";

export const Route = createFileRoute("/_layout/settings/")({
  component: UserSettingsPage,
});
