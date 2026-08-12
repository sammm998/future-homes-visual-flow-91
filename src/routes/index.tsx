import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import Newsletter from "@/components/Newsletter";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Index />
      <Newsletter />
    </>
  );
}
