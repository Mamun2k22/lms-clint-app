import type { ZodError, ZodIssue } from "zod";

export function zodToFieldErrors(err: ZodError): Record<string, string> {
  const out: Record<string, string> = {};

  // Modern Zod-এ সবসময় err.issues array থাকে
  const issues: ZodIssue[] = err.issues;

  for (const i of issues) {
    const key =
      Array.isArray(i.path) && i.path.length > 0
        ? i.path.join(".")
        : "form";

    out[key] = i.message;
  }
  return out;
}
