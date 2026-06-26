import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const auth = getAuth();
    throw redirect({ to: auth ? "/crm" : "/login" });
  },
  component: () => null,
});
