const BASE = process.env.NEXT_PUBLIC_API_BASE!;

/** Client-side calls (adds Bearer from localStorage) */
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) throw await res.json().catch(() => ({ message: res.statusText }));
  return (await res.json()) as T;
}

/** Server-side fetch (no token) for public endpoints */
export async function serverApi<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw await res.json().catch(() => ({ message: res.statusText }));
  return (await res.json()) as T;
}
