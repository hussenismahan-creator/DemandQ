import { cn } from "@/lib/utils";

/**
 * Shimmer skeleton used across loading states. The moving highlight is driven
 * by the `shimmer` keyframe defined in the Tailwind config.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/60",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-foreground/5 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
