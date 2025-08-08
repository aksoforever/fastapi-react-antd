import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";
import RecoverPasswordPage from "@/features/auth/RecoverPasswordPage";

export const Route = createFileRoute("/recover-password")({
  component: RecoverPasswordPage,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});
