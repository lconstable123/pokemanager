import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      autoComplete="off"
      required={false}
      className={cn(
        "transition-all duration-200 file:text-foreground placeholder:text-muted-foreground   flex h-9 w-full min-w-0   px-3 py-1 text-base shadow-xs  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-red-200  focus-visible:ring-ring/50 focus-visible:ring-[10px] ring-amber-300",
        "bg-white border-gray-800 border-2 hardShadow rounded-full",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
