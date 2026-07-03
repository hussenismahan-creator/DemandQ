import Link from "next/link";
import { cn } from "@/lib/utils";
import { APP, ROUTES } from "@/lib/constants";

interface LogoProps {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}

/** The DemandQ mark: a stylized signal/pulse glyph plus the wordmark. */
export function Logo({ className, href = ROUTES.landing, showWordmark = true }: LogoProps) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(280_86%_66%)] shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_8px_24px_-12px_hsl(var(--primary)/0.8)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4.5 w-4.5 text-primary-foreground"
          aria-hidden="true"
          style={{ width: 18, height: 18 }}
        >
          <path
            d="M2 12h4l2-6 4 12 3-9 2 3h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          {APP.name}
        </span>
      )}
    </Link>
  );
}
