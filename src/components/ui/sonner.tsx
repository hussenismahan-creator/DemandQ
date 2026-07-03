"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast host. Styled to match the dark product surface. Mounted once
 * in the root layout; trigger toasts anywhere via `import { toast } from "sonner"`.
 */
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group border border-border/60 bg-popover text-popover-foreground shadow-lg rounded-lg",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
    />
  );
}
