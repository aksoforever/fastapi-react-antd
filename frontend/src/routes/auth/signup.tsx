import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth";
import SignupPage from "@/features/auth/SignupPage";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});
