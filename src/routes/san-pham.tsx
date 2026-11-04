import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/san-pham")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
