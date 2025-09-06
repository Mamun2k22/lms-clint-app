import type { SelectHTMLAttributes } from "react";
import { cn } from "./Button";
export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-black/70",
        props.className
      )}
    />
  );
}
