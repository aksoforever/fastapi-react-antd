import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";
import LoginPage from "@/features/auth/LoginPage";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});
