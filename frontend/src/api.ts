/**
 * Erowho Holdings Limited — API client
 * All communication with the Flask backend goes through this module.
 *
 * API_BASE resolution order:
 *   1. window.API_BASE set in index.html (empty string in production → same-origin)
 *   2. Hostname check: localhost → http://localhost:5001
 *   3. Default: same origin ("")
 *
 * To point at a separate backend in production, set window.API_BASE
 * (or VITE_API_BASE_URL if migrating to Vite) to the full backend URL.
 */

function resolveBase(): string {
  const w = window as any;
  // window.API_BASE is set explicitly in index.html. Empty string means same-origin.
  if (typeof w.API_BASE === "string") return w.API_BASE;
  // Fallback: localhost dev server
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") return "http://localhost:5001";
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
  created_at: string;
}

export interface Stats {
  total_properties: number;
  published: number;
  available: number;
  rented: number;
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
    listProperties:  ()                              => get<Property[]>("/api/admin/properties", true),
    createProperty:  (data: Partial<Property>)       => post<Property>("/api/admin/properties", data, true),
    updateProperty:  (id: number, data: Partial<Property>) => put<Property>(`/api/admin/properties/${id}`, data),
    deleteProperty:  (id: number)                    => del<{ success: boolean; deleted: number }>(`/api/admin/properties/${id}`),
    togglePublish:   (id: number)                    => patch<Property>(`/api/admin/properties/${id}/publish`, {}),
    listInquiries:   ()                              => get<Inquiry[]>("/api/admin/inquiries", true),
    updateInquiryStatus: (id: number, status: string) => patch<{ success: boolean }>(`/api/admin/inquiries/${id}`, { status }),
    getStats:        ()                              => get<Stats>("/api/admin/stats", true),
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
