import React, { useState, useEffect } from "react";
import { C, F } from "../tokens";
import { api, Property, Inquiry, Stats } from "../api";
import { StatusBadge, Spinner, ErrorMsg, PageLoader } from "../components/ui";
import { PropTypeImage } from "../illustrations";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!password) { setError("Password is required."); return; }
    setLoading(true);
    setError("");
    try {
      const { token } = await api.auth.login(username, password);
      api.saveToken(token);
      onLogin();
      navigate("AdminDashboard");
    } catch (e: any) {
      setError(e.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
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
function AdminShell({ title, navigate, children, onLogout }: { title: string; navigate: (p: string) => void; children: React.ReactNode; onLogout: () => void }) {
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
      <div style={{ padding: "30px 28px 60px", maxWidth: 1140, margin: "0 auto" }}>{children}</div>
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
  const [tab, setTab] = useState<"properties" | "inquiries">("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const del = async (id: number) => {
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    try { await api.admin.deleteProperty(id); setProperties(prev => prev.filter(p => p.id !== id)); }
    catch (e: any) { setError(e.message); }
  };

  const togglePub = async (id: number) => {
    try {
      const updated = await api.admin.togglePublish(id);
      setProperties(prev => prev.map(p => p.id === id ? updated : p));
    } catch (e: any) { setError(e.message); }
  };

  const updateInquiryStatus = async (id: number, status: string) => {
    try {
      await api.admin.updateInquiryStatus(id, status);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: status as any } : inq));
    } catch (e: any) { setError(e.message); }
  };

  const Tab = ({ t, label }: { t: "properties" | "inquiries"; label: string }) => (
    <button onClick={() => setTab(t)} style={{
      background: "none", border: "none", cursor: "pointer",
      color: tab === t ? C.espresso : C.muted, fontSize: 14,
      padding: "10px 0", borderBottom: `2px solid ${tab === t ? C.gold : "transparent"}`,
      marginRight: 28, fontWeight: tab === t ? 600 : 400, letterSpacing: "0.02em",
      transition: "color 0.2s",
    }}>{label}</button>
  );

  return (
    <AdminShell title="Dashboard" navigate={navigate} onLogout={onLogout}>
      {/* Stats bar */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total", val: stats.total_properties, icon: "fa-building" },
            { label: "Published", val: stats.published, icon: "fa-eye" },
            { label: "Available", val: stats.available, icon: "fa-circle-check" },
            { label: "Rented", val: stats.rented, icon: "fa-house-user" },
            { label: "Inquiries", val: stats.total_inquiries, icon: "fa-envelope" },
            { label: "New", val: stats.new_inquiries, icon: "fa-bell" },
          ].map(({ label, val, icon }) => (
            <div key={label} style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <i className={`fas ${icon}`} style={{ fontSize: 13, color: C.clay }} />
                <p style={{ fontSize: 10, color: C.subtle, letterSpacing: "0.1em", fontWeight: 600 }}>{label.toUpperCase()}</p>
              </div>
              <p style={{ fontSize: 24, color: C.espresso, fontFamily: F.mono }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <Tab t="properties" label={`Properties (${properties.length})`} />
          <Tab t="inquiries" label={`Inquiries (${inquiries.length})`} />
        </div>
        {tab === "properties" && (
          <button className="btn-brass" onClick={() => { setEditTarget(null); navigate("AdminAddProperty"); }} style={{ padding: "9px 18px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
            <i className="fas fa-plus" />Add Property
          </button>
        )}
      </div>

      {error && <div style={{ marginBottom: 18 }}><ErrorMsg msg={error} /></div>}

      {loading ? <PageLoader /> : tab === "properties" ? (
        <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.stone}`, background: C.cream }}>
                {["Property", "Location", "Rent/mo", "Status", "Published", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", fontSize: 10, color: C.subtle, letterSpacing: "0.12em", textAlign: "left", fontWeight: 600 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((p, i) => (
                <tr key={p.id} className="arow" style={{ borderBottom: i < properties.length - 1 ? `1px solid ${C.stone}` : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 56, height: 42, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.stone}` }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.title} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <PropTypeImage propertyType={p.property_type} height={42} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, color: C.text, fontWeight: 500 }}>{p.title}</p>
                        <p style={{ fontSize: 11, color: C.muted }}>{p.property_type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: C.muted }}>{p.city}, {p.country}</td>
                  <td style={{ padding: "12px 16px", fontFamily: F.mono, fontSize: 13, color: C.espresso, fontWeight: 500 }}>${p.monthly_rent.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={p.availability_status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => togglePub(p.id)} style={{
                      background: p.is_published ? "rgba(200,168,107,0.12)" : C.cream,
                      border: `1px solid ${p.is_published ? C.gold : C.stone}`,
                      color: p.is_published ? C.gold : C.muted,
                      padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontWeight: 500,
                    }}>
                      <i className={`fas ${p.is_published ? "fa-eye" : "fa-eye-slash"}`} style={{ marginRight: 5, fontSize: 9 }} />
                      {p.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 7 }}>
                      <button onClick={() => { setEditTarget(p); navigate("AdminEditProperty"); }}
                        style={{ background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                        <i className="fas fa-pen" style={{ fontSize: 10 }} />Edit
                      </button>
                      <button className="btn-danger" onClick={() => del(p.id)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                        <i className="fas fa-trash" style={{ fontSize: 10 }} />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: C.muted }}>
              <i className="fas fa-home" style={{ fontSize: 32, color: C.stone, display: "block", marginBottom: 14 }} />
              No properties yet.{" "}
              <button className="btn-brass" onClick={() => navigate("AdminAddProperty")} style={{ padding: "7px 16px", borderRadius: 7, fontSize: 13, marginLeft: 8 }}>
                Add one
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {inquiries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: C.muted }}>
              <i className="fas fa-envelope-open" style={{ fontSize: 32, color: C.stone, display: "block", marginBottom: 14 }} />
              No inquiries received yet.
            </div>
          ) : inquiries.map(inq => (
            <div key={inq.id} style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 15.5, color: C.text, fontWeight: 500 }}>{inq.full_name}</p>
                  <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
                    <i className="fas fa-envelope" style={{ marginRight: 5, color: C.clay, fontSize: 11 }} />{inq.email}
                    {inq.phone && <><span style={{ margin: "0 8px", color: C.stone }}>·</span><i className="fas fa-phone" style={{ marginRight: 5, color: C.clay, fontSize: 11 }} />{inq.phone}</>}
                  </p>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 12.5, color: C.terracotta, fontWeight: 500 }}>{inq.property_title || "General inquiry"}</p>
                    <p style={{ fontSize: 11, color: C.subtle }}>{new Date(inq.created_at).toLocaleDateString()}</p>
                  </div>
                  <select value={inq.status} onChange={e => updateInquiryStatus(inq.id, e.target.value)}
                    style={{ background: C.cream, border: `1px solid ${C.stone}`, color: C.text, padding: "4px 9px", borderRadius: 6, fontSize: 11.5, cursor: "pointer" }}>
                    {["New", "Reviewed", "Contacted", "Closed"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {inq.message && (
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.68, borderTop: `1px solid ${C.stone}`, paddingTop: 12 }}>
                  {inq.message}
                </p>
              )}
              {(inq.desired_move_in_date || inq.number_of_occupants) && (
                <div style={{ display: "flex", gap: 18, marginTop: 10, fontSize: 12, color: C.subtle, flexWrap: "wrap" }}>
                  {inq.desired_move_in_date && (
                    <span><i className="fas fa-calendar" style={{ marginRight: 5, color: C.clay }} />Move-in: {inq.desired_move_in_date}</span>
                  )}
                  {inq.number_of_occupants && (
                    <span><i className="fas fa-people-group" style={{ marginRight: 5, color: C.clay }} />Occupants: {inq.number_of_occupants}</span>
                  )}
                </div>
              )}
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
  const isEdit = !!editTarget;
  const toStr  = (v: any) => Array.isArray(v) ? v.join(", ") : (v || "");
  const toGalleryStr = (v: any) => Array.isArray(v) ? v.join("\n") : (v || "");

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
    gallery_images:      toGalleryStr(editTarget?.gallery_images),
    is_published:        editTarget?.is_published ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.city || !form.monthly_rent) { setError("Title, city, and monthly rent are required."); return; }
    setSaving(true);
    setError("");
    try {
      const payload: Partial<Property> = {
        ...form,
        bedrooms:      parseFloat(form.bedrooms) || 1,
        bathrooms:     parseFloat(form.bathrooms) || 1,
        monthly_rent:  parseInt(form.monthly_rent) || 0,
        amenities:     form.amenities.split(",").map(a => a.trim()).filter(Boolean),
        gallery_images: form.gallery_images.split("\n").map(u => u.trim()).filter(Boolean),
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      };
      if (isEdit) await api.admin.updateProperty(editTarget!.id, payload);
      else await api.admin.createProperty(payload);
      navigate("AdminDashboard");
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const Lbl = ({ t }: { t: string }) => (
    <label style={{ fontSize: 10, color: C.subtle, letterSpacing: "0.12em", display: "block", marginBottom: 5, fontWeight: 600 }}>{t}</label>
  );

  return (
    <AdminShell title={isEdit ? `Edit: ${editTarget!.title}` : "Add Property"} navigate={navigate} onLogout={onLogout}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text }}>{isEdit ? "Edit Property" : "Add New Property"}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-outline" onClick={() => navigate("AdminDashboard")} style={{ padding: "9px 20px" }}>Cancel</button>
          <button className="btn-brass" onClick={save} disabled={saving} style={{ padding: "9px 24px", display: "flex", alignItems: "center", gap: 7 }}>
            {saving ? <><Spinner size={14} color={C.espresso} /> Saving…</> : <><i className="fas fa-floppy-disk" /> Save Property</>}
          </button>
        </div>
      </div>

      {/* Image preview */}
      <div style={{ marginBottom: 24 }}>
        <PropTypeImage
          propertyType={form.property_type}
          height={180}
          style={{ borderRadius: 12 }}
        />
        {form.image_url && (
          <div style={{ marginTop: 10, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.stone}` }}>
            <img
              src={form.image_url}
              alt="Property preview"
              onError={e => { (e.target as HTMLImageElement).src = ""; }}
              style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }}
            />
            <p style={{ padding: "8px 12px", fontSize: 11, color: C.muted, background: C.cream }}>
              <i className="fas fa-image" style={{ marginRight: 6, color: C.clay }} />
              Custom image preview
            </p>
          </div>
        )}
      </div>

      {error && <div style={{ marginBottom: 18 }}><ErrorMsg msg={error} /></div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left column */}
        <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 4 }}>Property Details</h3>
          <div style={{ gridColumn: "1/-1" }}>
            <Lbl t="TITLE *" /><input className="inp" value={form.title} onChange={up("title")} placeholder="Property title" />
          </div>
          <div>
            <Lbl t="SLUG (auto-generated if blank)" /><input className="inp" value={form.slug} onChange={up("slug")} placeholder="url-friendly-name" />
          </div>
          <div>
            <Lbl t="COUNTRY *" />
            <select className="inp" value={form.country} onChange={up("country")} style={{ cursor: "pointer" }}>
              <option>Canada</option><option>United States</option>
            </select>
          </div>
          <div>
            <Lbl t="CITY *" /><input className="inp" value={form.city} onChange={up("city")} placeholder="e.g. Toronto" />
          </div>
          <div>
            <Lbl t="ADDRESS / AREA" /><input className="inp" value={form.address_or_area} onChange={up("address_or_area")} placeholder="e.g. Midtown Toronto" />
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
            <input type="checkbox" id="pub" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.gold, cursor: "pointer" }} />
            <label htmlFor="pub" style={{ fontSize: 14, color: C.text, cursor: "pointer" }}>
              <i className="fas fa-eye" style={{ marginRight: 7, color: C.clay }} />
              Publish this property (visible on the public site)
            </label>
          </div>
        </div>

        {/* Right column — images */}
        <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 4 }}>Images</h3>

          <div style={{ background: C.sand, borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
              <i className="fas fa-circle-info" style={{ marginRight: 7, color: C.clay }} />
              Enter direct image URLs. Use{" "}
              <strong style={{ color: C.text }}>images.unsplash.com</strong>{" "}
              URLs in the format:<br />
              <code style={{ fontFamily: F.mono, fontSize: 11, color: C.terracotta, display: "block", marginTop: 6 }}>
                https://images.unsplash.com/photo-ID?auto=format&amp;fit=crop&amp;w=800&amp;q=80
              </code>
            </p>
          </div>

          <div>
            <Lbl t="MAIN IMAGE URL" />
            <input
              className="inp"
              value={form.image_url}
              onChange={up("image_url")}
              placeholder="https://images.unsplash.com/photo-…"
            />
            <p style={{ fontSize: 11, color: C.subtle, marginTop: 5 }}>
              This is the primary image shown on property cards and the detail page.
            </p>
          </div>

          {form.image_url && (
            <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.stone}` }}>
              <img
                src={form.image_url}
                alt="Main image preview"
                onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
              />
              <p style={{ padding: "8px 12px", fontSize: 11, color: C.muted, background: C.cream }}>
                <i className="fas fa-check-circle" style={{ marginRight: 6, color: "#4a9" }} />Main image preview
              </p>
            </div>
          )}

          <div>
            <Lbl t="GALLERY IMAGES (one URL per line)" />
            <textarea
              className="inp"
              value={form.gallery_images}
              onChange={up("gallery_images")}
              rows={5}
              style={{ resize: "vertical", fontFamily: F.mono, fontSize: 12 }}
              placeholder={"https://images.unsplash.com/photo-…\nhttps://images.unsplash.com/photo-…"}
            />
            <p style={{ fontSize: 11, color: C.subtle, marginTop: 5 }}>
              Additional images shown in the gallery on the property detail page. One URL per line.
            </p>
          </div>

          {form.gallery_images && (
            <div>
              <p style={{ fontSize: 11, color: C.subtle, marginBottom: 8, letterSpacing: "0.08em", fontWeight: 600 }}>GALLERY PREVIEW</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {form.gallery_images.split("\n").map((u, i) => u.trim() && (
                  <div key={i} style={{ width: 70, height: 50, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.stone}` }}>
                    <img src={u.trim()} alt={`Gallery ${i + 1}`} onError={e => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-brass" onClick={save} disabled={saving} style={{ padding: "12px 28px", display: "flex", alignItems: "center", gap: 7 }}>
          {saving ? <><Spinner size={14} color={C.espresso} /> Saving…</> : <><i className="fas fa-floppy-disk" /> Save Property</>}
        </button>
        <button className="btn-outline" onClick={() => navigate("AdminDashboard")} style={{ padding: "12px 22px" }}>Cancel</button>
      </div>
    </AdminShell>
  );
}
