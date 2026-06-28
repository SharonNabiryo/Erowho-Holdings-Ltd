/**
 * Erowho Holdings Limited — API client
 * All communication with the Flask backend goes through this module.
 *
 * API base URL resolution order:
 *   1. VITE_API_BASE_URL — build-time env var (Vite / esbuild --define).
 *      Set this when migrating to a separate frontend deploy or Vite build.
 *   2. window.API_BASE — runtime injection set in frontend/dist/index.html.
 *      Empty string ("") explicitly means same-origin. Vercel sets this to "".
 *   3. Hostname check — localhost/127.0.0.1 → http://localhost:5001 (dev).
 *   4. Empty string fallback — same-origin via relative fetch URLs (production).
 */

function resolveBase(): string {
  // 1. Build-time env var — Vite or esbuild --define:import.meta.env.VITE_API_BASE_URL
  const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL;
  if (typeof envBase === "string" && envBase.trim()) return envBase.trim();

  // 2. Runtime injection — set in frontend/dist/index.html
  //    Empty string ("") explicitly means same-origin; do not fall through.
  const w = window as any;
  if (typeof w.API_BASE === "string") return w.API_BASE;

  // 3. Local development — no index.html API_BASE detected
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") return "http://localhost:5001";

  // 4. Production fallback — same-origin via relative fetch URLs
  return "";
}

const BASE = resolveBase();

function getToken(): string | null {
  return localStorage.getItem("erowho_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({})) as any;
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data as T;
}

const get   = <T>(path: string, auth = false)           => request<T>("GET",    path, undefined, auth);
const post  = <T>(path: string, body: unknown, auth = false) => request<T>("POST",   path, body,      auth);
const put   = <T>(path: string, body: unknown)           => request<T>("PUT",    path, body,      true);
const del   = <T>(path: string)                          => request<T>("DELETE", path, undefined,  true);
const patch = <T>(path: string, body: unknown)           => request<T>("PATCH",  path, body,      true);

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Property {
  id: number;
  title: string;
  slug: string;
  country: string;
  city: string;
  address_or_area: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  availability_status: "Available" | "Coming Soon" | "Rented" | "Under Review";
  description: string;
  amenities: string[];
  image_url: string;
  gallery_images: string[];
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: number;
  property_id: number | null;
  property_title: string;
  full_name: string;
  email: string;
  phone: string;
  desired_move_in_date: string;
  number_of_occupants: string;
  message: string;
  status: "New" | "Reviewed" | "Contacted" | "Closed";
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total_properties: number;
  published: number;
  available: number;
  rented: number;
  featured: number;
  total_inquiries: number;
  new_inquiries: number;
}

export interface PropertyFilters {
  q?: string;
  country?: string;
  city?: string;
  property_type?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  min_rent?: string;
  max_rent?: string;
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (username: string, password: string) =>
      post<{ token: string; username: string }>("/api/auth/login", { username, password }),
    verify: () => get<{ valid: boolean; username: string }>("/api/auth/verify", true),
    changePassword: (current_password: string, new_password: string) =>
      post<{ success: boolean }>("/api/admin/change-password", { current_password, new_password }, true),
  },

  // ── Public ──────────────────────────────────────────────────────────────────
  properties: {
    list: (filters: PropertyFilters = {}) => {
      const params = new URLSearchParams();
      (Object.entries(filters) as [string, string | undefined][]).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      return get<Property[]>(`/api/properties${qs ? "?" + qs : ""}`);
    },
    get:       (id: number)   => get<Property>(`/api/properties/${id}`),
    getBySlug: (slug: string) => get<Property>(`/api/properties/slug/${slug}`),
  },

  // ── Admin ────────────────────────────────────────────────────────────────────
  admin: {
    listProperties:      ()                              => get<Property[]>("/api/admin/properties", true),
    getPropertyBySlug:   (slug: string)                 => get<Property>(`/api/admin/properties/slug/${slug}`, true),
    createProperty:      (data: Partial<Property>)      => post<Property>("/api/admin/properties", data, true),
    updateProperty:      (id: number, data: Partial<Property>) => put<Property>(`/api/admin/properties/${id}`, data),
    deleteProperty:      (id: number)                   => del<{ success: boolean; deleted: number }>(`/api/admin/properties/${id}`),
    togglePublish:       (id: number)                   => patch<Property>(`/api/admin/properties/${id}/publish`, {}),
    featureProperty:     (id: number)                   => patch<Property>(`/api/admin/properties/${id}/feature`, {}),
    listInquiries:       ()                             => get<Inquiry[]>("/api/admin/inquiries", true),
    updateInquiry:       (id: number, data: { status?: string; admin_notes?: string }) =>
                           patch<Inquiry>(`/api/admin/inquiries/${id}`, data),
    getStats:            ()                             => get<Stats>("/api/admin/stats", true),
  },

  inquiries: {
    create: (data: {
      property_id?: number;
      property_title?: string;
      full_name: string;
      email: string;
      phone?: string;
      desired_move_in_date?: string;
      number_of_occupants?: string;
      message?: string;
    }) => post<{ success: boolean; id: number }>("/api/inquiries", data),
  },

  contact: (data: {
    full_name: string;
    email: string;
    phone?: string;
    inquiry_type?: string;
    message?: string;
  }) => post<{ success: boolean; id: number }>("/api/contact", data),

  saveToken:  (token: string) => localStorage.setItem("erowho_token", token),
  clearToken: ()              => localStorage.removeItem("erowho_token"),
  hasToken:   ()              => !!getToken(),
};
