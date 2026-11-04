import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chung-nhan")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
