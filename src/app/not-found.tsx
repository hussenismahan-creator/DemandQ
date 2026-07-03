import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";

/** Global 404 page. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-radial-faded opacity-40" />
      <Logo href={ROUTES.landing} />
      <p className="mt-10 font-mono text-sm text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.landing}>
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={ROUTES.dashboard}>
            <Compass className="h-4 w-4" />
            Go to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
