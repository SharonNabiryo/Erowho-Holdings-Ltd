import React, { useState, useEffect, useCallback, useRef } from "react";
import { C, F } from "../tokens";
import { api, Property, Inquiry, Stats } from "../api";
import { StatusBadge, Spinner, ErrorMsg, PageLoader } from "../components/ui";
import { PropTypeImage } from "../illustrations";

// ── Toast ─────────────────────────────────────────────────────────────────────
interface ToastItem { id: number; msg: string; type: "success" | "error" }

function ToastStack({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#2a5c3a" : "#7a2020",
          color: "#fff", padding: "12px 16px 12px 14px", borderRadius: 10,
          fontSize: 13.5, display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 4px 24px rgba(0,0,0,0.22)", minWidth: 240, maxWidth: 360,
          pointerEvents: "all",
        }}>
          <i className={`fas ${t.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
          <button onClick={() => dismiss(t.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.65)", cursor: "pointer", padding: 0, fontSize: 14, flexShrink: 0 }}>
            <i className="fas fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ title, msg, onConfirm, onCancel }: {
  title: string; msg: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(30,10,2,0.55)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", maxWidth: 440, width: "100%", boxShadow: "0 16px 56px rgba(0,0,0,0.26)" }}>
        <h3 style={{ fontFamily: F.serif, fontSize: 21, fontWeight: 400, color: C.text, marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.72, marginBottom: 28 }}>{msg}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ background: "none", border: `1px solid ${C.stone}`, color: C.text, padding: "10px 22px", borderRadius: 8, fontSize: 13.5, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ background: "#b91c1c", border: "none", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            <i className="fas fa-trash" style={{ fontSize: 11 }} />Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────
function downloadCsv(filename: string, rows: any[], cols: { key: string; label: string }[]) {
  const header = cols.map(c => JSON.stringify(c.label)).join(",");
  const body   = rows.map(row =>
    cols.map(c => {
      const v = row[c.key];
      return JSON.stringify(Array.isArray(v) ? v.join("; ") : (v ?? ""));
    }).join(",")
  ).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Image URL helpers ─────────────────────────────────────────────────────────
function isUnsplashPageUrl(url: string): boolean {
  return /https?:\/\/(www\.)?unsplash\.com\/photos\//i.test(url);
}

function validateImageUrl(url: string): string {
  if (!url) return "";
  if (isUnsplashPageUrl(url)) {
    return (
      "This is an Unsplash page link, not a direct image URL. " +
      "Use the direct image URL from images.unsplash.com — it starts with " +
      "https://images.unsplash.com/photo-… and includes sizing parameters."
    );
  }
  if (!url.startsWith("http")) {
    return "URL must start with https://.";
  }
  return "";
}

// ── useWindowWidth ────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
export function AdminLoginPage({
  navigate,
  onLogin,
}: {
  navigate: (p: string) => void;
  onLogin: () => void;
}) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = async () => {
    if (!password) { setError("Password is required."); return; }
    setLoading(true); setError("");
    try {
      const { token } = await api.auth.login(username, password);
      api.saveToken(token);
      onLogin();
      navigate("AdminDashboard");
    } catch (e: any) {
      setError(e.message || "Invalid credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.charcoal, border: "1px solid rgba(90,78,68,0.6)", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontFamily: F.serif, fontSize: 22, color: "#FAF6F0", marginBottom: 4 }}>Erowho Holdings Limited</p>
          <p style={{ fontSize: 9.5, color: C.clay, letterSpacing: "0.24em" }}>ADMIN ACCESS</p>
        </div>
        {error && <div style={{ marginBottom: 16 }}><ErrorMsg msg={error} /></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="inp inp-dark" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input className="inp inp-dark" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Password" />
          <button className="btn-brass" onClick={submit} disabled={loading}
            style={{ padding: "13px", borderRadius: 8, fontSize: 14, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><Spinner size={16} color={C.espresso} /> Signing in…</> : <><i className="fas fa-right-to-bracket" /> Sign In</>}
          </button>
        </div>
        <p style={{ fontSize: 11, color: "rgba(215,199,181,0.3)", textAlign: "center", marginTop: 22 }}>Default: admin / admin123</p>
        <button onClick={() => navigate("Home")} style={{ background: "none", border: "none", color: "rgba(215,199,181,0.35)", fontSize: 12, cursor: "pointer", display: "block", margin: "16px auto 0", textDecoration: "underline" }}>
          ← Back to website
        </button>
      </div>
    </div>
  );
}

// ── ADMIN SHELL ───────────────────────────────────────────────────────────────
function AdminShell({ title, navigate, children, onLogout }: {
  title: string; navigate: (p: string) => void; children: React.ReactNode; onLogout: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F1E8" }}>
      <div style={{
        background: C.espresso, borderBottom: "1px solid rgba(90,78,68,0.4)",
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 58, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: F.serif, fontSize: 18, color: "#FAF6F0", cursor: "pointer" }} onClick={() => navigate("AdminDashboard")}>
            Erowho Admin
          </span>
          <span style={{ fontSize: 12, color: "rgba(215,199,181,0.3)" }}>|</span>
          <span style={{ fontSize: 13, color: C.clay }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => navigate("Home")} style={{ background: "none", border: "none", color: "rgba(215,199,181,0.5)", fontSize: 12, cursor: "pointer" }}>
            <i className="fas fa-arrow-up-right-from-square" style={{ marginRight: 5 }} />View site
          </button>
          <button className="btn-outline-dark" onClick={onLogout} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12 }}>
            <i className="fas fa-right-from-bracket" style={{ marginRight: 6 }} />Sign Out
          </button>
        </div>
      </div>
      <div style={{ padding: "30px 28px 60px", maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
export function AdminDashboard({
  navigate,
  onLogout,
  setEditTarget,
}: {
  navigate: (p: string, data?: any) => void;
  onLogout: () => void;
  setEditTarget: (p: Property | null) => void;
}) {
  const [tab, setTab]               = useState<"properties" | "inquiries">("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries]   = useState<Inquiry[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = ++nextId.current;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Delete confirmation
  const [pendingDelete, setPendingDelete] = useState<{ id: number; title: string } | null>(null);

  // Property filters
  const [pSearch, setPSearch]       = useState("");
  const [pStatus, setPStatus]       = useState("");
  const [pPublished, setPPublished] = useState("");
  const [pCountry, setPCountry]     = useState("");
  const [pType, setPType]           = useState("");

  // Inquiry filters
  const [iStatus, setIStatus] = useState("");
  const [iProp, setIProp]     = useState("");

  // Per-inquiry note edits
  const [noteEdits, setNoteEdits] = useState<Record<number, string>>({});

  const windowWidth = useWindowWidth();
  const isMobile    = windowWidth < 768;
  const statCols    = windowWidth < 600 ? "repeat(3, 1fr)" : "repeat(6, 1fr)";

  const load = async () => {
    setLoading(true);
    try {
      const [ps, inqs, st] = await Promise.all([
        api.admin.listProperties(),
        api.admin.listInquiries(),
        api.admin.getStats(),
      ]);
      setProperties(ps);
      setInquiries(inqs);
      setStats(st);
      const notes: Record<number, string> = {};
      inqs.forEach(inq => { notes[inq.id] = inq.admin_notes || ""; });
      setNoteEdits(notes);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Reload inquiries (and stats) each time the inquiries tab is opened,
  // so newly submitted inquiries appear without a full page refresh.
  useEffect(() => {
    if (tab !== "inquiries") return;
    (async () => {
      try {
        const [inqs, st] = await Promise.all([
          api.admin.listInquiries(),
          api.admin.getStats(),
        ]);
        setInquiries(inqs);
        setStats(st);
        const notes: Record<number, string> = {};
        inqs.forEach(inq => { notes[inq.id] = inq.admin_notes || ""; });
        setNoteEdits(notes);
      } catch { /* keep stale data on failure */ }
    })();
  }, [tab]);

  // Filtered lists
  const filteredProperties = properties.filter(p => {
    const q = pSearch.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
    if (pStatus && p.availability_status !== pStatus) return false;
    if (pPublished === "published" && !p.is_published) return false;
    if (pPublished === "draft" && p.is_published) return false;
    if (pCountry && p.country !== pCountry) return false;
    if (pType && p.property_type !== pType) return false;
    return true;
  });

  const filteredInquiries = inquiries.filter(inq => {
    if (iStatus && inq.status !== iStatus) return false;
    if (iProp && !(inq.property_title || "").toLowerCase().includes(iProp.toLowerCase())) return false;
    return true;
  });

  const countries = [...new Set(properties.map(p => p.country))].sort();
  const propTypes = [...new Set(properties.map(p => p.property_type))].sort();
  const hasPropertyFilters = !!(pSearch || pStatus || pPublished || pCountry || pType);
  const hasInquiryFilters  = !!(iStatus || iProp);

  // Actions
  const doDelete = async (id: number) => {
    try {
      await api.admin.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      addToast("Property deleted.");
    } catch (e: any) { addToast(e.message, "error"); }
    finally { setPendingDelete(null); }
  };

  const togglePub = async (id: number) => {
    try {
      const updated = await api.admin.togglePublish(id);
      setProperties(prev => prev.map(p => p.id === id ? updated : p));
      addToast(updated.is_published ? "Property published." : "Property moved to draft.");
    } catch (e: any) { addToast(e.message, "error"); }
  };

  const toggleFeature = async (id: number) => {
    try {
      const updated = await api.admin.featureProperty(id);
      setProperties(prev => prev.map(p => p.id === id ? updated : p));
      addToast(updated.is_featured ? "Marked as featured — shows on homepage." : "Removed from featured.");
    } catch (e: any) { addToast(e.message, "error"); }
  };

  const updateInquiry = async (id: number, data: { status?: string; admin_notes?: string }) => {
    try {
      await api.admin.updateInquiry(id, data);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, ...data } : inq));
      if ("status" in data) addToast(`Inquiry marked as ${data.status}.`);
      else addToast("Note saved.");
    } catch (e: any) { addToast(e.message, "error"); }
  };

  // Jump to filtered tab
  const jumpToProperties = (filters: { pStatus?: string; pPublished?: string }) => {
    setTab("properties");
    setPSearch(""); setPCountry(""); setPType("");
    setPStatus(filters.pStatus || "");
    setPPublished(filters.pPublished || "");
  };
  const jumpToInquiries = (status?: string) => {
    setTab("inquiries");
    setIProp(""); setIStatus(status || "");
  };

  const fInp: React.CSSProperties = {
    background: C.cream, border: `1px solid ${C.stone}`, color: C.text,
    padding: "7px 10px", borderRadius: 7, fontSize: 12.5, outline: "none",
  };
  const fSel: React.CSSProperties = { ...fInp, cursor: "pointer" };

  const TabBtn = ({ t, label }: { t: "properties" | "inquiries"; label: string }) => (
    <button onClick={() => setTab(t)} style={{
      background: "none", border: "none", cursor: "pointer",
      color: tab === t ? C.espresso : C.muted, fontSize: 14,
      padding: "10px 0", borderBottom: `2px solid ${tab === t ? C.gold : "transparent"}`,
      marginRight: 28, fontWeight: tab === t ? 600 : 400, letterSpacing: "0.02em",
    }}>{label}</button>
  );

  return (
    <AdminShell title="Dashboard" navigate={navigate} onLogout={onLogout}>
      <ToastStack toasts={toasts} dismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

      {pendingDelete && (
        <ConfirmModal
          title="Delete property?"
          msg={`Are you sure you want to delete "${pendingDelete.title}"? This action cannot be undone.`}
          onConfirm={() => doDelete(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {/* Stat cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: statCols, gap: 14, marginBottom: 32 }}>
          {([
            { label: "Total",     val: stats.total_properties, icon: "fa-building",     action: () => jumpToProperties({}) },
            { label: "Published", val: stats.published,        icon: "fa-eye",          action: () => jumpToProperties({ pPublished: "published" }) },
            { label: "Available", val: stats.available,        icon: "fa-circle-check", action: () => jumpToProperties({ pStatus: "Available", pPublished: "published" }) },
            { label: "Rented",    val: stats.rented,           icon: "fa-house-user",   action: () => jumpToProperties({ pStatus: "Rented" }) },
            { label: "Inquiries", val: stats.total_inquiries,  icon: "fa-envelope",     action: () => jumpToInquiries() },
            { label: "New",       val: stats.new_inquiries,    icon: "fa-bell",         action: () => jumpToInquiries("New") },
          ] as { label: string; val: number; icon: string; action: () => void }[]).map(({ label, val, icon, action }) => (
            <div key={label} onClick={action} title={`Click to filter by ${label}`}
              style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"; el.style.borderColor = C.clay; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = C.stone; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <i className={`fas ${icon}`} style={{ fontSize: 12, color: C.clay }} />
                <p style={{ fontSize: 9.5, color: C.subtle, letterSpacing: "0.1em", fontWeight: 600 }}>{label.toUpperCase()}</p>
              </div>
              <p style={{ fontSize: 24, color: C.espresso, fontFamily: F.mono }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Demo storage notice */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FBF5E8", border: "1px solid #E0D0A0", borderRadius: 8, padding: "9px 14px", marginBottom: 20, fontSize: 12, color: "#8A6A2A", lineHeight: 1.55 }}>
        <i className="fas fa-triangle-exclamation" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Demo storage:</strong> Data is saved in SQLite and may reset on server restart or Vercel cold start.
          Inquiries and property changes will persist reliably once Supabase/Postgres is connected.
        </span>
      </div>

      {/* Tabs + toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <TabBtn t="properties" label={`Properties (${properties.length})`} />
          <TabBtn t="inquiries"  label={`Inquiries (${inquiries.length})`} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tab === "properties" && (
            <>
              <button onClick={() => downloadCsv("erowho-properties.csv", filteredProperties, [
                  { key: "title",               label: "Title" },
                  { key: "city",                label: "City" },
                  { key: "country",             label: "Country" },
                  { key: "property_type",       label: "Type" },
                  { key: "bedrooms",            label: "Beds" },
                  { key: "bathrooms",           label: "Baths" },
                  { key: "monthly_rent",        label: "Rent/mo ($)" },
                  { key: "availability_status", label: "Status" },
                  { key: "is_published",        label: "Published" },
                  { key: "is_featured",         label: "Featured" },
                  { key: "created_at",          label: "Created" },
                ])}
                style={{ background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "7px 13px", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <i className="fas fa-file-csv" style={{ fontSize: 10 }} />Export CSV
              </button>
              <button className="btn-brass" onClick={() => { setEditTarget(null); navigate("AdminAddProperty"); }}
                style={{ padding: "9px 18px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
                <i className="fas fa-plus" />Add Property
              </button>
            </>
          )}
          {tab === "inquiries" && (
            <>
              <button
                onClick={() => {
                  api.admin.listInquiries().then(inqs => {
                    setInquiries(inqs);
                    const notes: Record<number, string> = {};
                    inqs.forEach(inq => { notes[inq.id] = inq.admin_notes || ""; });
                    setNoteEdits(notes);
                    addToast(`Inquiries refreshed — ${inqs.length} total.`);
                  }).catch((e: any) => addToast(e.message, "error"));
                  api.admin.getStats().then(setStats).catch(() => {});
                }}
                style={{ background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "7px 13px", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <i className="fas fa-rotate-right" style={{ fontSize: 10 }} />Refresh
              </button>
            <button onClick={() => downloadCsv("erowho-inquiries.csv", filteredInquiries, [
                { key: "full_name",            label: "Name" },
                { key: "email",                label: "Email" },
                { key: "phone",                label: "Phone" },
                { key: "property_title",       label: "Property" },
                { key: "desired_move_in_date", label: "Desired Move-in" },
                { key: "number_of_occupants",  label: "Occupants" },
                { key: "message",              label: "Message" },
                { key: "status",               label: "Status" },
                { key: "admin_notes",          label: "Admin Notes" },
                { key: "created_at",           label: "Submitted" },
              ])}
              style={{ background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "7px 13px", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-file-csv" style={{ fontSize: 10 }} />Export CSV
            </button>
            </>
          )}
        </div>
      </div>

      {error && <div style={{ marginBottom: 18 }}><ErrorMsg msg={error} /></div>}

      {/* Property filters */}
      {tab === "properties" && !loading && properties.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: "12px 14px", background: "#fff", border: `1px solid ${C.stone}`, borderRadius: 10 }}>
          <input value={pSearch} onChange={e => setPSearch(e.target.value)} placeholder="Search name or city…" style={{ ...fInp, minWidth: 180 }} />
          <select value={pStatus} onChange={e => setPStatus(e.target.value)} style={fSel}>
            <option value="">All statuses</option>
            {["Available", "Coming Soon", "Rented", "Under Review"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={pPublished} onChange={e => setPPublished(e.target.value)} style={fSel}>
            <option value="">Published + Draft</option>
            <option value="published">Published only</option>
            <option value="draft">Draft only</option>
          </select>
          {countries.length > 1 && (
            <select value={pCountry} onChange={e => setPCountry(e.target.value)} style={fSel}>
              <option value="">All countries</option>
              {countries.map(c => <option key={c}>{c}</option>)}
            </select>
          )}
          {propTypes.length > 1 && (
            <select value={pType} onChange={e => setPType(e.target.value)} style={fSel}>
              <option value="">All types</option>
              {propTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          )}
          {hasPropertyFilters && (
            <>
              <button onClick={() => { setPSearch(""); setPStatus(""); setPPublished(""); setPCountry(""); setPType(""); }}
                style={{ background: "none", border: "none", color: C.clay, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" }}>
                <i className="fas fa-xmark" />Reset
              </button>
              <span style={{ fontSize: 11, color: C.subtle }}>{filteredProperties.length} / {properties.length}</span>
            </>
          )}
        </div>
      )}

      {/* Inquiry filters */}
      {tab === "inquiries" && !loading && inquiries.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: "12px 14px", background: "#fff", border: `1px solid ${C.stone}`, borderRadius: 10 }}>
          <select value={iStatus} onChange={e => setIStatus(e.target.value)} style={fSel}>
            <option value="">All statuses</option>
            {["New", "Reviewed", "Contacted", "Closed"].map(s => <option key={s}>{s}</option>)}
          </select>
          <input value={iProp} onChange={e => setIProp(e.target.value)} placeholder="Filter by property name…" style={{ ...fInp, minWidth: 200 }} />
          {hasInquiryFilters && (
            <>
              <button onClick={() => { setIStatus(""); setIProp(""); }}
                style={{ background: "none", border: "none", color: C.clay, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" }}>
                <i className="fas fa-xmark" />Reset
              </button>
              <span style={{ fontSize: 11, color: C.subtle }}>{filteredInquiries.length} / {inquiries.length}</span>
            </>
          )}
        </div>
      )}

      {loading ? <PageLoader /> : tab === "properties" ? (

        isMobile ? (
          /* Mobile property cards */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredProperties.length === 0 ? (
              <div style={{ textAlign: "center", padding: "44px 28px", color: C.muted }}>
                <i className="fas fa-home" style={{ fontSize: 28, color: C.stone, display: "block", marginBottom: 12 }} />
                {hasPropertyFilters ? "No properties match your filters." : (
                  <>No properties yet.{" "}
                    <button className="btn-brass" onClick={() => navigate("AdminAddProperty")} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12 }}>Add one</button>
                  </>
                )}
              </div>
            ) : filteredProperties.map(p => (
              <div key={p.id} style={{ background: "#fff", border: `1px solid ${C.stone}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 60, height: 46, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.stone}` }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.title} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      : <PropTypeImage propertyType={p.property_type} height={46} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, color: C.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                    <p style={{ fontSize: 11.5, color: C.muted }}>{p.property_type} · {p.city}, {p.country}</p>
                    <p style={{ fontFamily: F.mono, fontSize: 13, color: C.espresso, marginTop: 2 }}>${p.monthly_rent.toLocaleString()}/mo</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                  <StatusBadge status={p.availability_status} />
                  <button onClick={() => togglePub(p.id)} style={{
                    background: p.is_published ? "rgba(200,168,107,0.12)" : C.cream,
                    border: `1px solid ${p.is_published ? C.gold : C.stone}`,
                    color: p.is_published ? C.gold : C.muted,
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontWeight: 500,
                  }}>
                    <i className={`fas ${p.is_published ? "fa-eye" : "fa-eye-slash"}`} style={{ marginRight: 4, fontSize: 9 }} />
                    {p.is_published ? "Published" : "Draft"}
                  </button>
                  <button onClick={() => toggleFeature(p.id)} title={p.is_featured ? "Remove from featured" : "Feature on homepage"}
                    style={{ background: "none", border: "none", cursor: "pointer", color: p.is_featured ? C.gold : C.stone, fontSize: 18, padding: "2px", lineHeight: 1 }}>
                    <i className={`fa${p.is_featured ? "s" : "r"} fa-star`} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => p.is_published
                      ? window.open(`/?p=${p.slug}`, "_blank")
                      : addToast(`"${p.title}" is a draft — publish it first to preview publicly. Admins can still open /?p=${p.slug} while logged in.`, "error")}
                    title={p.is_published ? "Preview on public site" : "Draft — must be published to preview publicly"}
                    style={{ background: "none", border: `1px solid ${p.is_published ? C.stone : C.clay}`, color: p.is_published ? C.muted : C.clay, padding: "5px 11px", borderRadius: 6, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: 9 }} />Preview
                  </button>
                  <button onClick={() => { setEditTarget(p); navigate("AdminEditProperty"); }}
                    style={{ background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 11px", borderRadius: 6, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fas fa-pen" style={{ fontSize: 9 }} />Edit
                  </button>
                  <button onClick={() => setPendingDelete({ id: p.id, title: p.title })}
                    style={{ background: "#b91c1c", border: "none", color: "#fff", padding: "5px 11px", borderRadius: 6, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fas fa-trash" style={{ fontSize: 9 }} />Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop property table */
          <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.stone}`, background: C.cream }}>
                  {["Property", "Location", "Rent/mo", "Status", "Published", "Featured", "Actions"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", fontSize: 10, color: C.subtle, letterSpacing: "0.12em", textAlign: "left", fontWeight: 600 }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((p, i) => (
                  <tr key={p.id} className="arow" style={{ borderBottom: i < filteredProperties.length - 1 ? `1px solid ${C.stone}` : "none" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div style={{ width: 52, height: 40, borderRadius: 7, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.stone}` }}>
                          {p.image_url
                            ? <img src={p.image_url} alt={p.title} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            : <PropTypeImage propertyType={p.property_type} height={40} />}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{p.title}</p>
                          <p style={{ fontSize: 11, color: C.muted }}>{p.property_type}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12.5, color: C.muted, whiteSpace: "nowrap" }}>{p.city}, {p.country}</td>
                    <td style={{ padding: "12px 14px", fontFamily: F.mono, fontSize: 13, color: C.espresso, fontWeight: 500, whiteSpace: "nowrap" }}>${p.monthly_rent.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px" }}><StatusBadge status={p.availability_status} /></td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => togglePub(p.id)} style={{
                        background: p.is_published ? "rgba(200,168,107,0.12)" : C.cream,
                        border: `1px solid ${p.is_published ? C.gold : C.stone}`,
                        color: p.is_published ? C.gold : C.muted,
                        padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap",
                      }}>
                        <i className={`fas ${p.is_published ? "fa-eye" : "fa-eye-slash"}`} style={{ marginRight: 5, fontSize: 9 }} />
                        {p.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <button onClick={() => toggleFeature(p.id)} title={p.is_featured ? "Remove from homepage featured" : "Feature on homepage"}
                        style={{ background: "none", border: "none", cursor: "pointer", color: p.is_featured ? C.gold : C.stone, fontSize: 20, lineHeight: 1, padding: 0 }}>
                        <i className={`fa${p.is_featured ? "s" : "r"} fa-star`} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => p.is_published
                            ? window.open(`/?p=${p.slug}`, "_blank")
                            : addToast(`"${p.title}" is a draft — publish it first to preview publicly. Admins can still open /?p=${p.slug} while logged in.`, "error")}
                          title={p.is_published ? "Preview on public site" : "Draft — publish first to preview publicly"}
                          style={{ background: "none", border: `1px solid ${p.is_published ? C.stone : C.clay}`, color: p.is_published ? C.muted : C.clay, padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: 10 }} />Preview
                        </button>
                        <button onClick={() => { setEditTarget(p); navigate("AdminEditProperty"); }}
                          style={{ background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="fas fa-pen" style={{ fontSize: 10 }} />Edit
                        </button>
                        <button onClick={() => setPendingDelete({ id: p.id, title: p.title })}
                          style={{ background: "#b91c1c", border: "none", color: "#fff", padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="fas fa-trash" style={{ fontSize: 10 }} />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProperties.length === 0 && (
              <div style={{ padding: "48px", textAlign: "center", color: C.muted }}>
                <i className="fas fa-home" style={{ fontSize: 32, color: C.stone, display: "block", marginBottom: 14 }} />
                {hasPropertyFilters
                  ? "No properties match your filters."
                  : <>No properties yet.{" "}
                      <button className="btn-brass" onClick={() => navigate("AdminAddProperty")} style={{ padding: "7px 16px", borderRadius: 7, fontSize: 13, marginLeft: 8 }}>Add one</button>
                    </>}
              </div>
            )}
          </div>
        )

      ) : (
        /* Inquiries tab */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredInquiries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: C.muted }}>
              <i className="fas fa-envelope-open" style={{ fontSize: 32, color: C.stone, display: "block", marginBottom: 14 }} />
              {hasInquiryFilters ? "No inquiries match your filters." : "No inquiries received yet."}
            </div>
          ) : filteredInquiries.map(inq => (
            <div key={inq.id} style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "18px 22px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 15.5, color: C.text, fontWeight: 500, marginBottom: 5 }}>{inq.full_name}</p>
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                    <a href={`mailto:${inq.email}`} style={{ fontSize: 13, color: C.espresso, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="fas fa-envelope" style={{ color: C.clay, fontSize: 10 }} />{inq.email}
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} style={{ fontSize: 13, color: C.espresso, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                        <i className="fas fa-phone" style={{ color: C.clay, fontSize: 10 }} />{inq.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 12.5, color: C.terracotta, fontWeight: 500 }}>{inq.property_title || "General inquiry"}</p>
                    <p style={{ fontSize: 11, color: C.subtle }}>{new Date(inq.created_at).toLocaleDateString()}</p>
                  </div>
                  <select value={inq.status} onChange={e => updateInquiry(inq.id, { status: e.target.value })}
                    style={{ background: C.cream, border: `1px solid ${C.stone}`, color: C.text, padding: "5px 9px", borderRadius: 6, fontSize: 11.5, cursor: "pointer" }}>
                    {["New", "Reviewed", "Contacted", "Closed"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Details */}
              {(inq.desired_move_in_date || inq.number_of_occupants) && (
                <div style={{ display: "flex", gap: 18, marginBottom: 10, fontSize: 12, color: C.subtle, flexWrap: "wrap" }}>
                  {inq.desired_move_in_date && <span><i className="fas fa-calendar" style={{ marginRight: 5, color: C.clay }} />Move-in: {inq.desired_move_in_date}</span>}
                  {inq.number_of_occupants  && <span><i className="fas fa-people-group" style={{ marginRight: 5, color: C.clay }} />Occupants: {inq.number_of_occupants}</span>}
                </div>
              )}

              {/* Message */}
              {inq.message && (
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.68, borderTop: `1px solid ${C.stone}`, paddingTop: 12, marginBottom: 12 }}>
                  {inq.message}
                </p>
              )}

              {/* Admin notes */}
              <div style={{ borderTop: `1px solid ${C.stone}`, paddingTop: 12 }}>
                <p style={{ fontSize: 10, color: C.subtle, letterSpacing: "0.1em", marginBottom: 6, fontWeight: 600 }}>ADMIN NOTES</p>
                <textarea
                  value={noteEdits[inq.id] ?? ""}
                  onChange={e => setNoteEdits(prev => ({ ...prev, [inq.id]: e.target.value }))}
                  placeholder="Add a private note about this inquiry…"
                  rows={2}
                  style={{ width: "100%", resize: "vertical", background: C.cream, border: `1px solid ${C.stone}`, borderRadius: 7, padding: "8px 10px", fontSize: 12.5, color: C.text, fontFamily: "inherit", boxSizing: "border-box", display: "block", outline: "none" }}
                />
                <button onClick={() => updateInquiry(inq.id, { admin_notes: noteEdits[inq.id] ?? "" })}
                  style={{ marginTop: 7, background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="fas fa-floppy-disk" style={{ fontSize: 10 }} />Save note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

// ── ADMIN PROPERTY FORM ───────────────────────────────────────────────────────
export function AdminPropertyForm({
  editTarget,
  navigate,
  onLogout,
}: {
  editTarget: Property | null;
  navigate: (p: string) => void;
  onLogout: () => void;
}) {
  const isEdit    = !!editTarget;
  const toStr     = (v: any) => Array.isArray(v) ? v.join(", ") : (v || "");
  const toGallery = (v: any) => Array.isArray(v) ? v.join("\n") : (v || "");

  const [form, setForm] = useState({
    title:               editTarget?.title || "",
    slug:                editTarget?.slug || "",
    country:             editTarget?.country || "Canada",
    city:                editTarget?.city || "",
    address_or_area:     editTarget?.address_or_area || "",
    property_type:       editTarget?.property_type || "Single-Family Home",
    bedrooms:            String(editTarget?.bedrooms ?? 3),
    bathrooms:           String(editTarget?.bathrooms ?? 2),
    monthly_rent:        String(editTarget?.monthly_rent ?? 2000),
    availability_status: editTarget?.availability_status || "Available",
    description:         editTarget?.description || "",
    amenities:           toStr(editTarget?.amenities),
    image_url:           editTarget?.image_url || "",
    gallery_images:      toGallery(editTarget?.gallery_images),
    is_published:        editTarget?.is_published ?? true,
    is_featured:         editTarget?.is_featured ?? false,
  });

  const [saving, setSaving]           = useState(false);
  const [saved,  setSaved]            = useState(false);
  const [savedSlug, setSavedSlug]     = useState("");
  const [error,  setError]            = useState("");
  const [mainImgError, setMainImgError]       = useState(() => validateImageUrl(editTarget?.image_url || ""));
  const [mainImgLoadFailed, setMainImgLoadFailed] = useState(false);

  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImageUrlChange = (url: string) => {
    setForm(f => ({ ...f, image_url: url }));
    setMainImgError(validateImageUrl(url));
    setMainImgLoadFailed(false);
  };

  const save = async () => {
    if (!form.title || !form.city || !form.monthly_rent) {
      setError("Title, city, and monthly rent are required.");
      return;
    }
    const imgErr = validateImageUrl(form.image_url);
    if (imgErr) {
      setError("Main image URL is invalid: " + imgErr);
      return;
    }
    // Warn about broken main image but don't block (user may intentionally clear it)
    setSaving(true); setError("");
    try {
      const payload: any = {
        ...form,
        bedrooms:       parseFloat(form.bedrooms) || 1,
        bathrooms:      parseFloat(form.bathrooms) || 1,
        monthly_rent:   parseInt(form.monthly_rent) || 0,
        amenities:      form.amenities.split(",").map((a: string) => a.trim()).filter(Boolean),
        gallery_images: form.gallery_images.split("\n").map((u: string) => u.trim()).filter(u => u && !isUnsplashPageUrl(u)),
      };
      // Send slug only if the admin explicitly typed one.
      // Empty slug = let the backend generate from title (avoids wrong client-side slugify).
      if (!form.slug.trim()) delete payload.slug;
      else payload.slug = form.slug.trim();

      const result: Property = isEdit
        ? await api.admin.updateProperty(editTarget!.id, payload)
        : await api.admin.createProperty(payload);

      setSavedSlug(result.slug);
      setSaved(true);
      setTimeout(() => navigate("AdminDashboard"), 1400);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const Lbl = ({ t }: { t: string }) => (
    <label style={{ fontSize: 10, color: C.subtle, letterSpacing: "0.12em", display: "block", marginBottom: 5, fontWeight: 600 }}>{t}</label>
  );

  return (
    <AdminShell title={isEdit ? `Edit: ${editTarget!.title}` : "Add Property"} navigate={navigate} onLogout={onLogout}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text }}>{isEdit ? "Edit Property" : "Add New Property"}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("AdminDashboard")} style={{ background: "none", border: `1px solid ${C.stone}`, color: C.text, padding: "9px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button className="btn-brass" onClick={save} disabled={saving || saved}
            style={{ padding: "9px 24px", display: "flex", alignItems: "center", gap: 7 }}>
            {saved ? <><i className="fas fa-check" /> Saved{savedSlug ? ` — slug: ${savedSlug}` : "!"}</> : saving ? <><Spinner size={14} color={C.espresso} /> Saving…</> : <><i className="fas fa-floppy-disk" /> Save Property</>}
          </button>
        </div>
      </div>

      {/* Image preview banner */}
      {form.image_url && !mainImgError ? (
        <div style={{ marginBottom: 24, borderRadius: 12, overflow: "hidden", border: `1px solid ${mainImgLoadFailed ? "#d4a8a0" : C.stone}` }}>
          {!mainImgLoadFailed && (
            <img src={form.image_url} alt="Property preview"
              onLoad={() => setMainImgLoadFailed(false)}
              onError={() => setMainImgLoadFailed(true)}
              style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
          )}
          {mainImgLoadFailed ? (
            <div style={{ padding: "24px 20px", textAlign: "center", background: "#FDF0EE" }}>
              <i className="fas fa-image" style={{ fontSize: 28, color: "#d4a8a0", display: "block", marginBottom: 10 }} />
              <p style={{ fontSize: 12.5, color: "#9A4040", lineHeight: 1.55, marginBottom: 10 }}>
                Image failed to load. Check that the URL points directly to an image file, not a web page.
              </p>
              <button onClick={() => handleImageUrlChange("")}
                style={{ background: "none", border: "1px solid #d4a8a0", color: "#9A4040", padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
                Clear URL
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", background: C.cream }}>
              <p style={{ fontSize: 11, color: C.muted }}>
                <i className="fas fa-image" style={{ marginRight: 6, color: C.clay }} />Main image preview
              </p>
              <button onClick={() => handleImageUrlChange("")}
                style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <i className="fas fa-xmark" style={{ fontSize: 10 }} />Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          <PropTypeImage propertyType={form.property_type} height={180} style={{ borderRadius: 12 }} />
        </div>
      )}

      {error && <div style={{ marginBottom: 18 }}><ErrorMsg msg={error} /></div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left — property details */}
        <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 4 }}>Property Details</h3>
          <div><Lbl t="TITLE *" /><input className="inp" value={form.title} onChange={up("title")} placeholder="Property title" /></div>
          <div><Lbl t="SLUG (auto-generated if blank)" /><input className="inp" value={form.slug} onChange={up("slug")} placeholder="url-friendly-name" /></div>
          <div>
            <Lbl t="COUNTRY *" />
            <select className="inp" value={form.country} onChange={up("country")} style={{ cursor: "pointer" }}>
              <option>Canada</option><option>United States</option>
            </select>
          </div>
          <div><Lbl t="CITY *" /><input className="inp" value={form.city} onChange={up("city")} placeholder="e.g. Toronto" /></div>
          <div><Lbl t="ADDRESS / AREA" /><input className="inp" value={form.address_or_area} onChange={up("address_or_area")} placeholder="e.g. Midtown Toronto" /></div>
          <div>
            <Lbl t="PROPERTY TYPE" />
            <select className="inp" value={form.property_type} onChange={up("property_type")} style={{ cursor: "pointer" }}>
              {["Single-Family Home", "Townhome", "Duplex", "Apartment", "Condo", "Multifamily"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Lbl t="AVAILABILITY STATUS" />
            <select className="inp" value={form.availability_status} onChange={up("availability_status")} style={{ cursor: "pointer" }}>
              {["Available", "Coming Soon", "Rented", "Under Review"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><Lbl t="BEDS" /><input className="inp" type="number" step="1" min="0" value={form.bedrooms} onChange={up("bedrooms")} /></div>
            <div><Lbl t="BATHS" /><input className="inp" type="number" step="0.5" min="0" value={form.bathrooms} onChange={up("bathrooms")} /></div>
            <div><Lbl t="RENT ($)/MO *" /><input className="inp" type="number" value={form.monthly_rent} onChange={up("monthly_rent")} /></div>
          </div>
          <div>
            <Lbl t="DESCRIPTION" />
            <textarea className="inp" value={form.description} onChange={up("description")} rows={4} style={{ resize: "vertical" }} placeholder="Describe the property…" />
          </div>
          <div>
            <Lbl t="AMENITIES (comma-separated)" />
            <input className="inp" value={form.amenities} onChange={up("amenities")} placeholder="In-unit laundry, Parking, Central air, Pet-friendly" />
          </div>

          {/* Publish + Feature */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4, borderTop: `1px solid ${C.stone}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="pub" checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: C.gold, cursor: "pointer" }} />
              <label htmlFor="pub" style={{ fontSize: 14, color: C.text, cursor: "pointer" }}>
                <i className="fas fa-eye" style={{ marginRight: 7, color: C.clay }} />Publish (visible on public site)
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="feat" checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: C.gold, cursor: "pointer" }} />
              <label htmlFor="feat" style={{ fontSize: 14, color: C.text, cursor: "pointer" }}>
                <i className="fas fa-star" style={{ marginRight: 7, color: C.gold }} />Feature on homepage
              </label>
            </div>
          </div>
        </div>

        {/* Right — images */}
        <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 4 }}>Images</h3>

          {/* File upload — coming soon */}
          <div style={{ background: C.cream, border: `1.5px dashed ${C.stone}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <i className="fas fa-cloud-arrow-up" style={{ color: C.clay, fontSize: 13 }} />
              <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>File Upload — Coming Soon</p>
            </div>
            <p style={{ fontSize: 11.5, color: C.subtle, lineHeight: 1.6 }}>
              Direct file upload (JPG, PNG, WEBP) will be available once Supabase Storage is connected.
              For now, use direct image URLs in the fields below.
            </p>
          </div>

          {/* Main image URL */}
          <div>
            <Lbl t="MAIN IMAGE URL" />
            <input
              className="inp"
              value={form.image_url}
              onChange={e => handleImageUrlChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-…"
              style={{ borderColor: mainImgError ? "#c07070" : undefined }}
            />
            {mainImgError ? (
              <p style={{ fontSize: 11, color: "#9A4040", marginTop: 5, lineHeight: 1.55, background: "#FDF0EE", padding: "6px 10px", borderRadius: 6 }}>
                <i className="fas fa-triangle-exclamation" style={{ marginRight: 5 }} />{mainImgError}
              </p>
            ) : (
              <p style={{ fontSize: 11, color: C.subtle, marginTop: 5, lineHeight: 1.55 }}>
                Use a direct image URL from <strong>images.unsplash.com</strong> or any URL ending in .jpg/.png/.webp.
                Do not paste the regular Unsplash page link from the browser address bar.
              </p>
            )}
          </div>

          {/* Gallery URLs */}
          <div>
            <Lbl t="GALLERY IMAGES (one direct URL per line)" />
            <textarea className="inp" value={form.gallery_images} onChange={up("gallery_images")} rows={5}
              style={{ resize: "vertical", fontFamily: F.mono, fontSize: 12 }}
              placeholder={"https://images.unsplash.com/photo-…\nhttps://images.unsplash.com/photo-…"} />
            <p style={{ fontSize: 11, color: C.subtle, marginTop: 5 }}>
              One direct image URL per line. Unsplash page links are skipped automatically.
            </p>
          </div>

          {/* Gallery preview */}
          {form.gallery_images && (
            <div>
              <p style={{ fontSize: 11, color: C.subtle, marginBottom: 8, letterSpacing: "0.08em", fontWeight: 600 }}>GALLERY PREVIEW</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {form.gallery_images.split("\n").map((rawUrl, i) => {
                  const u = rawUrl.trim();
                  if (!u) return null;
                  const isPage = isUnsplashPageUrl(u);
                  return (
                    <div key={i} style={{ position: "relative", width: 72, height: 52, flexShrink: 0 }}>
                      <div style={{ width: "100%", height: "100%", borderRadius: 6, overflow: "hidden", border: `1px solid ${isPage ? "#d4a8a0" : C.stone}` }}>
                        {isPage ? (
                          <div style={{ width: "100%", height: "100%", background: "#FDF0EE", display: "flex", alignItems: "center", justifyContent: "center" }} title="Unsplash page link — will be skipped">
                            <i className="fas fa-triangle-exclamation" style={{ color: "#c07070", fontSize: 15 }} />
                          </div>
                        ) : (
                          <img src={u} alt={`Gallery ${i + 1}`}
                            onError={e => {
                              const el = e.target as HTMLImageElement;
                              el.style.display = "none";
                              if (el.parentElement) el.parentElement.style.background = C.cream;
                            }}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        )}
                      </div>
                      {isPage && (
                        <div style={{ position: "absolute", bottom: -16, left: 0, right: 0, textAlign: "center" }}>
                          <span style={{ fontSize: 9, color: "#9A4040" }}>page link</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {form.gallery_images.split("\n").some(u => isUnsplashPageUrl(u.trim())) && (
                <p style={{ fontSize: 11, color: "#9A4040", marginTop: 18, lineHeight: 1.55 }}>
                  <i className="fas fa-triangle-exclamation" style={{ marginRight: 5 }} />
                  One or more gallery URLs are Unsplash page links and will be skipped on save.
                  Use direct image URLs from <strong>images.unsplash.com</strong> instead.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-brass" onClick={save} disabled={saving || saved}
          style={{ padding: "12px 28px", display: "flex", alignItems: "center", gap: 7 }}>
          {saved ? <><i className="fas fa-check" /> Saved!</> : saving ? <><Spinner size={14} color={C.espresso} /> Saving…</> : <><i className="fas fa-floppy-disk" /> Save Property</>}
        </button>
        <button onClick={() => navigate("AdminDashboard")} style={{ background: "none", border: `1px solid ${C.stone}`, color: C.text, padding: "12px 22px", borderRadius: 8, fontSize: 13.5, cursor: "pointer" }}>Cancel</button>
      </div>
    </AdminShell>
  );
}
