import type { TextareaHTMLAttributes } from "react";
import { cn } from "./Button";
export default function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/70",
        props.className
      )}
    />
  );
}
