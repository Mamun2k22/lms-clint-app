"use client";
import type { ButtonHTMLAttributes } from "react";
// import { cn } from "@/lib/cn"; 

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};
export default function Button({ className, variant = "primary", size="md", loading, children, ...rest }: Props) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm"
  }[size];
  const variants = {
    primary: "bg-black text-white hover:opacity-95",
    outline: "border hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:opacity-95"
  }[variant];
  return (
    <button className={cn(base, sizes, variants, className)} {...rest}>
      {loading ? "Loading…" : children}
    </button>
  );
}

// tiny className joiner
export function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}
