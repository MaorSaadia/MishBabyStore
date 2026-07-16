import { Compass } from "lucide-react";

import Container from "@/components/ui/Container";

export default function PromoBanner() {
  return (
    <aside className="bg-brand-hover text-white" aria-label="MishBaby introduction">
      <Container className="flex min-h-9 items-center justify-center gap-2 py-2 text-center text-xs font-semibold sm:text-sm">
        <Compass className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
        <p>
          <span className="sm:hidden">Discover trusted baby products and brands.</span>
          <span className="hidden sm:inline">Discover baby products across trusted retailers and brands.</span>
        </p>
      </Container>
    </aside>
  );
}
