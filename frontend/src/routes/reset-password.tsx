import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});
