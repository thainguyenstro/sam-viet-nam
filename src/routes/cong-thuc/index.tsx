import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cong-thuc/")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "cong-thuc" });
  },
});
