import React, { useState, useEffect } from "react";
import { C, F, HERO_IMAGE, PROPERTY_IMAGES } from "../tokens";
import { api, Property, PropertyFilters } from "../api";
import { StatusBadge, PropertyCard, PageLoader, ErrorMsg, Spinner } from "../components/ui";
import { PropImage } from "../illustrations";

// ── Shared section label ───────────────────────────────────────────────────────
function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p style={{
      fontSize: 10, letterSpacing: "0.22em", fontWeight: 600,
      color: light ? "rgba(200,168,107,0.8)" : C.terracotta,
      marginBottom: 12, textTransform: "uppercase",
    }}>
      {children}
    </p>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
export function HomePage({ navigate }: { navigate: (p: string, data?: any) => void }) {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState({ location: "", beds: "", maxRent: "" });
  const [activePhase, setActivePhase] = useState<number | null>(null);

  useEffect(() => {
    api.properties.list().then(ps => {
      setFeatured(ps.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const doHeroSearch = () => {
    const filters: Record<string, string> = {};
    if (heroSearch.location) filters.q = heroSearch.location;
    if (heroSearch.beds)     filters.bedrooms = heroSearch.beds;
    if (heroSearch.maxRent)  filters.max_rent = heroSearch.maxRent;
    navigate("Rentals", Object.keys(filters).length ? filters : undefined);
  };

  const phases = [
    { n: "01", title: "First Acquisitions", desc: "Identifying and securing rental assets in selected markets guided by long-term fundamentals." },
    { n: "02", title: "Stabilize & Rent", desc: "Preparing properties and establishing stable, responsibly managed rental operations." },
    { n: "03", title: "Improve & Optimize", desc: "Improving property quality, tenant experience, and operating efficiency where appropriate." },
    { n: "04", title: "Expand Markets", desc: "Growing into additional Canadian and U.S. markets where demand and ownership fundamentals align." },
    { n: "05", title: "Diversified Portfolio", desc: "Building a mature, income-producing rental portfolio held for the long term." },
  ];

  const principles = [
    { icon: "fa-clock-rotate-left", title: "Long-Term Ownership", desc: "We acquire to hold, not to flip. Every property is managed with permanence in mind." },
    { icon: "fa-seedling", title: "Responsible Growth", desc: "Portfolio expansion guided by fundamentals, not momentum or market noise." },
    { icon: "fa-house-chimney", title: "Stable Housing", desc: "Providing quality rental homes that tenants can rely on over time." },
    { icon: "fa-magnifying-glass-chart", title: "Disciplined Acquisition", desc: "Every property passes through a careful review before joining our portfolio." },
    { icon: "fa-earth-americas", title: "Cross-Border Vision", desc: "Operating across Canada and the United States with a unified investment approach." },
    { icon: "fa-handshake", title: "Tenant Respect", desc: "We treat tenants as the foundation of a well-run portfolio, not a transaction." },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={HERO_IMAGE}
            alt="Beautiful rental home"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(42,33,27,0.78) 0%, rgba(58,48,40,0.60) 55%, rgba(42,33,27,0.40) 100%)",
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1240, margin: "0 auto", padding: "140px 28px 100px",
          width: "100%",
        }}>
          <div style={{ maxWidth: 680 }}>
            <Label light>EROWHO HOLDINGS · CANADA &amp; UNITED STATES</Label>
            <h1 style={{
              fontFamily: F.serif,
              fontSize: "clamp(38px, 5.2vw, 68px)",
              fontWeight: 300, color: "#FAF6F0",
              lineHeight: 1.08, marginBottom: 24, letterSpacing: "-0.01em",
            }}>
              Find Rental Homes<br />
              <em style={{ color: C.gold, fontStyle: "italic" }}>Owned for the Long Term</em>
            </h1>
            <p style={{
              fontSize: 17, color: "rgba(250,246,240,0.82)",
              lineHeight: 1.82, marginBottom: 44, maxWidth: 530,
            }}>
              Erowho Holdings Limited acquires, owns, and manages income-producing rental properties across Canada and the United States, offering stable rental housing through a growing long-term portfolio.
            </p>

            {/* Hero Search */}
            <div className="glass-card" style={{ padding: "22px 24px", maxWidth: 680, marginBottom: 36 }}>
              <p style={{ fontSize: 11, color: C.clay, letterSpacing: "0.14em", marginBottom: 14, fontWeight: 600 }}>
                FIND A RENTAL
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr auto", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>LOCATION</label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-magnifying-glass" style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      color: C.clay, fontSize: 12,
                    }} />
                    <input
                      className="inp"
                      value={heroSearch.location}
                      onChange={e => setHeroSearch({ ...heroSearch, location: e.target.value })}
                      placeholder="City or country…"
                      style={{ paddingLeft: 32 }}
                      onKeyDown={e => e.key === "Enter" && doHeroSearch()}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>BEDROOMS</label>
                  <select className="inp" value={heroSearch.beds} onChange={e => setHeroSearch({ ...heroSearch, beds: e.target.value })} style={{ cursor: "pointer" }}>
                    <option value="">Any</option>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>MAX RENT</label>
                  <input
                    className="inp"
                    type="number"
                    value={heroSearch.maxRent}
                    onChange={e => setHeroSearch({ ...heroSearch, maxRent: e.target.value })}
                    placeholder="No limit"
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={doHeroSearch}
                  style={{ padding: "10px 20px", marginTop: 21, whiteSpace: "nowrap" }}>
                  <i className="fas fa-search" style={{ marginRight: 7 }} />
                  Search
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => navigate("Rentals")} style={{ padding: "14px 30px" }}>
                View Available Rentals
              </button>
              <button className="btn-outline-dark" onClick={() => navigate("About")} style={{ padding: "14px 28px" }}>
                Learn About Erowho Holdings Limited
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1,
        }}>
          <span style={{ fontSize: 9, color: "rgba(215,199,181,0.5)", letterSpacing: "0.18em" }}>SCROLL</span>
          <i className="fas fa-chevron-down" style={{ color: "rgba(215,199,181,0.4)", fontSize: 12, animation: "fadeIn 1s ease infinite alternate" }} />
        </div>
      </section>

      {/* ── Featured Rentals ── */}
      <section style={{ background: C.ivory, padding: "92px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
            <div>
              <Label>Current Listings</Label>
              <h2 style={{ fontFamily: F.serif, fontSize: 44, fontWeight: 300, color: C.text, lineHeight: 1.1 }}>
                Available Rentals
              </h2>
              <p style={{ color: C.muted, marginTop: 10, fontSize: 15 }}>
                Properties owned, operated, or controlled by Erowho Holdings Limited.
              </p>
            </div>
            <button className="btn-outline" onClick={() => navigate("Rentals")} style={{ padding: "10px 22px", whiteSpace: "nowrap" }}>
              View All <i className="fas fa-arrow-right" style={{ marginLeft: 6, fontSize: 11 }} />
            </button>
          </div>

          {loading ? <PageLoader /> : featured.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <i className="fas fa-home" style={{ fontSize: 40, color: C.stone, marginBottom: 16, display: "block" }} />
              <p style={{ color: C.muted }}>No rentals available at the moment. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {featured.map(p => (
                <PropertyCard key={p.id} prop={p} onClick={prop => navigate("PropertyDetail", prop)} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 52 }}>
            <button className="btn-primary" onClick={() => navigate("Rentals")} style={{ padding: "14px 36px" }}>
              Browse All Properties
            </button>
          </div>
        </div>
      </section>

      {/* ── Rental Match Preview ── */}
      <section style={{ background: C.sand, padding: "96px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <Label>Rental Match Preview</Label>
            <h2 style={{ fontFamily: F.serif, fontSize: 44, fontWeight: 300, color: C.text, lineHeight: 1.15, marginBottom: 22 }}>
              Homes Ready for Long-Term Renters
            </h2>
            <p style={{ color: C.muted, lineHeight: 1.85, fontSize: 15, marginBottom: 32 }}>
              Each property in the Erowho Holdings Limited portfolio is owned and managed by us — not listed by a third-party agent or brokerage. When you inquire, you deal directly with the company that owns the home.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {[
                { icon: "fa-handshake", text: "Inquire directly with the property owner" },
                { icon: "fa-clock-rotate-left", text: "Stable, long-term rental terms" },
                { icon: "fa-house-chimney-user", text: "Professionally managed residential homes" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <i className={`fas ${icon}`} style={{ color: C.gold, fontSize: 15, width: 20, textAlign: "center" as const }} />
                  <span style={{ fontSize: 14, color: C.text }}>{text}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => navigate("Rentals")} style={{ padding: "13px 28px" }}>
              Browse All Rentals
            </button>
          </div>

          <div>
            {(() => {
              const spotlight = featured.find(p => p.availability_status === "Available") || featured[0];
              if (!spotlight) return (
                <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "48px 32px", textAlign: "center" }}>
                  <i className="fas fa-key" style={{ fontSize: 40, color: C.stone, display: "block", marginBottom: 18 }} />
                  <h3 style={{ fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 10 }}>New Listings Coming Soon</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>Erowho Holdings Limited is actively growing its rental portfolio. Check back soon for new available properties.</p>
                </div>
              );
              return (
                <div
                  onClick={() => navigate("PropertyDetail", spotlight)}
                  style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 16px 48px rgba(42,33,27,0.12)", transition: "transform 0.25s, box-shadow 0.25s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 26px 64px rgba(42,33,27,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(42,33,27,0.12)"; }}
                >
                  <div style={{ position: "relative", height: 270 }}>
                    <PropImage property={spotlight} height={270} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(42,33,27,0.6) 0%, transparent 55%)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                      <h3 style={{ fontFamily: F.serif, fontSize: 24, color: "#FAF6F0", marginBottom: 4 }}>{spotlight.title}</h3>
                      <p style={{ fontSize: 13, color: "rgba(250,246,240,0.78)", display: "flex", alignItems: "center", gap: 6 }}>
                        <i className="fas fa-location-dot" />{spotlight.city}, {spotlight.country}
                      </p>
                    </div>
                    <div style={{ position: "absolute", top: 14, right: 14 }}><StatusBadge status={spotlight.availability_status} /></div>
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 20 }}>
                        {[
                          { icon: "fa-bed", val: `${spotlight.bedrooms} bed` },
                          { icon: "fa-shower", val: `${spotlight.bathrooms} bath` },
                          { icon: "fa-home", val: spotlight.property_type },
                        ].map(({ icon, val }) => (
                          <span key={val} style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
                            <i className={`fas ${icon}`} style={{ color: C.clay, fontSize: 11 }} />{val}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontFamily: F.serif, fontSize: 21, color: C.espresso }}>
                        ${spotlight.monthly_rent.toLocaleString()}<span style={{ fontSize: 12, color: C.muted, fontFamily: F.sans }}>/mo</span>
                      </span>
                    </div>
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.stone}`, display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ color: C.gold, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                        View Property <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ── About preview — split section ── */}
      <section style={{ background: C.charcoal, padding: "96px 28px", position: "relative", overflow: "hidden" }}>
        {/* Decorative background shape */}
        <div style={{
          position: "absolute", right: -80, top: "50%", transform: "translateY(-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,168,107,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <Label light>Who We Are</Label>
            <h2 style={{
              fontFamily: F.serif, fontSize: 42, fontWeight: 300,
              color: "#FAF6F0", lineHeight: 1.18, marginBottom: 22,
            }}>
              A Holding Company Built Around Long-Term Rental Ownership
            </h2>
            <p style={{ color: "rgba(215,199,181,0.7)", lineHeight: 1.85, marginBottom: 20, fontSize: 15 }}>
              Erowho Holdings Limited is a privately held real estate investment company focused on acquiring, owning, improving, and managing rental properties across Canada and the United States.
            </p>
            <div style={{
              background: "rgba(200,168,107,0.08)", border: "1px solid rgba(200,168,107,0.18)",
              borderRadius: 10, padding: "14px 18px", marginBottom: 28,
            }}>
              <p style={{ fontSize: 13, color: "rgba(200,168,107,0.85)", lineHeight: 1.7 }}>
                <i className="fas fa-circle-info" style={{ marginRight: 8 }} />
                We are not a brokerage or public listing marketplace. The rentals shown on this website are properties owned, operated, or controlled by Erowho Holdings Limited.
              </p>
            </div>
            <button className="btn-outline-dark" onClick={() => navigate("About")} style={{ padding: "11px 24px" }}>
              Learn More <i className="fas fa-arrow-right" style={{ marginLeft: 7, fontSize: 11 }} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: "fa-magnifying-glass", title: "Acquire", desc: "We identify and acquire rental properties in selected markets guided by long-term fundamentals." },
              { icon: "fa-building", title: "Own", desc: "We hold rental assets for the long term, focusing on stability and responsible stewardship." },
              { icon: "fa-screwdriver-wrench", title: "Improve", desc: "We improve property quality, tenant experience, and long-term value where appropriate." },
              { icon: "fa-house-user", title: "Rent", desc: "We provide stable rental housing through properties we own, operate, and control." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: "rgba(74,62,52,0.5)", border: "1px solid rgba(90,78,68,0.5)",
                borderRadius: 12, padding: "22px 18px",
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,168,107,0.35)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(74,62,52,0.8)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(90,78,68,0.5)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(74,62,52,0.5)";
                }}>
                <i className={`fas ${icon}`} style={{ color: C.gold, fontSize: 18, marginBottom: 12, display: "block" }} />
                <h3 style={{ fontFamily: F.serif, fontSize: 19, fontWeight: 400, color: "#FAF6F0", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "rgba(215,199,181,0.6)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Growth Vision ── */}
      <section style={{ background: C.sand, padding: "96px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Label>Strategic Roadmap</Label>
            <h2 style={{ fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: C.text, marginBottom: 14 }}>
              Portfolio Growth Vision
            </h2>
            <p style={{ color: C.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.78, fontSize: 15 }}>
              Acquire thoughtfully, stabilize responsibly, improve where needed, and grow with discipline.
            </p>
          </div>
          <div style={{ display: "flex", position: "relative", alignItems: "flex-start" }}>
            <div style={{
              position: "absolute", top: 28, left: "9%", right: "9%",
              height: 1, background: C.stone,
            }} />
            {phases.map((p, i) => (
              <div key={i} onClick={() => setActivePhase(activePhase === i ? null : i)}
                style={{ flex: 1, textAlign: "center", cursor: "pointer", padding: "0 8px", position: "relative" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: activePhase === i ? C.gold : "#FFF",
                  border: `2px solid ${activePhase === i ? C.gold : C.stone}`,
                  margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.28s", position: "relative", zIndex: 1,
                  boxShadow: activePhase === i ? "0 6px 20px rgba(200,168,107,0.35)" : "none",
                }}>
                  <span style={{ fontFamily: F.mono, fontSize: 11, color: activePhase === i ? C.espresso : C.muted }}>{p.n}</span>
                </div>
                <h4 style={{
                  fontFamily: F.serif, fontSize: 14.5,
                  color: activePhase === i ? C.espresso : C.muted,
                  transition: "color 0.28s", lineHeight: 1.3, marginBottom: 8,
                }}>{p.title}</h4>
                <div style={{
                  overflow: "hidden",
                  maxHeight: activePhase === i ? 120 : 0,
                  opacity: activePhase === i ? 1 : 0,
                  transition: "max-height 0.4s, opacity 0.3s",
                }}>
                  <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.68, marginTop: 4 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 10, color: C.subtle, marginTop: 36, letterSpacing: "0.12em" }}>
            CLICK EACH PHASE TO EXPAND
          </p>
        </div>
      </section>

      {/* ── Property Review Lens ── */}
      <section style={{ background: "#FFF", padding: "88px 28px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Label>Acquisition Criteria</Label>
            <h2 style={{ fontFamily: F.serif, fontSize: 44, fontWeight: 300, color: C.text, marginBottom: 14 }}>
              Property Review Lens
            </h2>
            <p style={{ color: C.muted, lineHeight: 1.78, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
              Before adding a property to our portfolio, we consider the fundamentals that support long-term rental ownership.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
            {[
              { icon: "fa-chart-bar",            label: "Rental demand" },
              { icon: "fa-map-location-dot",     label: "Neighborhood fundamentals" },
              { icon: "fa-dollar-sign",          label: "Rental performance potential" },
              { icon: "fa-screwdriver-wrench",   label: "Property condition" },
              { icon: "fa-clock-rotate-left",    label: "Long-term ownership value" },
              { icon: "fa-people-group",         label: "Tenant suitability" },
              { icon: "fa-building-columns",     label: "Market stability" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                background: C.ivory, border: `1px solid ${C.stone}`, borderRadius: 10,
                padding: "16px 18px", display: "flex", alignItems: "center", gap: 12,
                transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(42,33,27,0.08)";
                  (e.currentTarget as HTMLElement).style.background = "#FFF";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.stone;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.background = C.ivory;
                }}>
                <i className={`fas ${icon}`} style={{ color: C.gold, fontSize: 15, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: C.text }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Canada & U.S. Markets ── */}
      <section style={{
        background: C.espresso, padding: "96px 28px", position: "relative", overflow: "hidden",
      }}>
        {/* Subtle map texture background */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.gold} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Label light>Our Markets</Label>
            <h2 style={{ fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: "#FAF6F0", marginBottom: 14 }}>
              Canada &amp; United States
            </h2>
            <p style={{ color: "rgba(215,199,181,0.65)", maxWidth: 500, margin: "0 auto", lineHeight: 1.78, fontSize: 15 }}>
              Erowho Holdings Limited builds a geographically diversified rental portfolio across two of North America's largest residential markets.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              {
                flag: "🇨🇦", country: "Canada",
                desc: "Focused on established Canadian rental markets with strong long-term demand and fundamentals — targeting residential properties suited to long-term holding.",
                highlights: ["Toronto, ON", "Ottawa, ON", "Calgary, AB", "Vancouver, BC"],
              },
              {
                flag: "🇺🇸", country: "United States",
                desc: "Exploring selected U.S. markets where rental demand, affordability, and population growth create sustainable long-term rental opportunities.",
                highlights: ["Dallas, TX", "Houston, TX", "Atlanta, GA", "Phoenix, AZ"],
              },
            ].map(({ flag, country, desc, highlights }) => (
              <div key={country} style={{
                background: "rgba(74,62,52,0.4)", border: "1px solid rgba(90,78,68,0.5)",
                borderRadius: 14, padding: "32px 28px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 36 }}>{flag}</span>
                  <h3 style={{ fontFamily: F.serif, fontSize: 28, fontWeight: 300, color: "#FAF6F0" }}>{country}</h3>
                </div>
                <p style={{ fontSize: 14, color: "rgba(215,199,181,0.65)", lineHeight: 1.8, marginBottom: 22 }}>{desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {highlights.map(h => (
                    <span key={h} style={{
                      fontSize: 12, color: C.gold,
                      background: "rgba(200,168,107,0.1)", border: "1px solid rgba(200,168,107,0.22)",
                      padding: "4px 12px", borderRadius: 20,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <i className="fas fa-location-dot" style={{ fontSize: 9 }} />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section style={{ background: C.cream, padding: "96px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>What Guides Us</Label>
            <h2 style={{ fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: C.text }}>Our Principles</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {principles.map((p, i) => (
              <div key={i} style={{
                background: "#FFF", border: `1px solid ${C.stone}`,
                borderRadius: 14, padding: "28px 24px",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(42,33,27,0.10)";
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = C.stone;
                }}>
                <i className={`fas ${p.icon}`} style={{ color: C.gold, fontSize: 20, marginBottom: 14, display: "block" }} />
                <h3 style={{ fontFamily: F.serif, fontSize: 20, fontWeight: 400, color: C.text, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "88px 28px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            {
              tag: "FOR RENTERS", title: "Looking for a rental?",
              desc: "Browse available properties and submit a rental inquiry for any listing that interests you.",
              btn: "View Rentals", act: () => navigate("Rentals"), primary: true,
            },
            {
              tag: "GENERAL INQUIRIES", title: "Have a question?",
              desc: "Contact Erowho Holdings Limited for general company or portfolio inquiries.",
              btn: "Contact Us", act: () => navigate("Contact"), primary: false,
            },
          ].map(({ tag, title, desc, btn, act, primary }) => (
            <div key={tag} style={{
              background: "rgba(74,62,52,0.4)", border: "1px solid rgba(90,78,68,0.5)",
              borderRadius: 14, padding: "34px 28px",
            }}>
              <Label light>{tag}</Label>
              <h3 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: "#FAF6F0", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "rgba(215,199,181,0.65)", lineHeight: 1.78, marginBottom: 24 }}>{desc}</p>
              {primary
                ? <button className="btn-primary" onClick={act} style={{ padding: "11px 24px" }}>{btn}</button>
                : <button className="btn-outline-dark" onClick={act} style={{ padding: "11px 24px" }}>{btn}</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── RENTALS ───────────────────────────────────────────────────────────────────
export function RentalsPage({
  navigate,
  initialFilters = {},
}: {
  navigate: (p: string, data?: any) => void;
  initialFilters?: { q?: string; country?: string; property_type?: string; bedrooms?: string; status?: string; max_rent?: string };
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialFilters.q || "");
  const [country, setCountry] = useState(initialFilters.country || "");
  const [propType, setPropType] = useState(initialFilters.property_type || "");
  const [beds, setBeds] = useState(initialFilters.bedrooms || "");
  const [status, setStatus] = useState(initialFilters.status || "");
  const [maxRent, setMaxRent] = useState(initialFilters.max_rent || "");

  useEffect(() => {
    setLoading(true);
    const f: PropertyFilters = {};
    if (search) f.q = search;
    if (country) f.country = country;
    if (propType) f.property_type = propType;
    if (beds) f.bedrooms = beds;
    if (status) f.status = status;
    if (maxRent) f.max_rent = maxRent;
    api.properties.list(f)
      .then(ps => { setProperties(ps); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [search, country, propType, beds, status, maxRent]);

  const clear = () => { setSearch(""); setCountry(""); setPropType(""); setBeds(""); setStatus(""); setMaxRent(""); };
  const hasFilters = !!(search || country || propType || beds || status || maxRent);

  const FLabel = ({ children }: { children: React.ReactNode }) => (
    <label style={{ fontSize: 10, color: C.subtle, letterSpacing: "0.12em", display: "block", marginBottom: 5, fontWeight: 600 }}>
      {children}
    </label>
  );

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Page header */}
      <section style={{
        background: `linear-gradient(180deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "60px 28px 52px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Label light>EROWHO HOLDINGS</Label>
          <h1 style={{ fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 10 }}>
            Available Rentals
          </h1>
          <p style={{ color: "rgba(215,199,181,0.65)", fontSize: 15, maxWidth: 540 }}>
            Browse rental properties owned, operated, or controlled by Erowho Holdings Limited across Canada and the United States.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <div style={{ background: "#FFF", borderBottom: `1px solid ${C.stone}`, padding: "20px 28px", boxShadow: "0 2px 12px rgba(42,33,27,0.06)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <div>
              <FLabel>SEARCH</FLabel>
              <div style={{ position: "relative" }}>
                <i className="fas fa-magnifying-glass" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.clay, fontSize: 12 }} />
                <input className="inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="City, country, or property name" style={{ paddingLeft: 32 }} />
              </div>
            </div>
            <div>
              <FLabel>COUNTRY</FLabel>
              <select className="inp" value={country} onChange={e => setCountry(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">All Countries</option>
                <option>Canada</option>
                <option>United States</option>
              </select>
            </div>
            <div>
              <FLabel>TYPE</FLabel>
              <select className="inp" value={propType} onChange={e => setPropType(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">All Types</option>
                {["Single-Family Home","Townhome","Duplex","Apartment","Condo","Multifamily"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <FLabel>MIN BEDS</FLabel>
              <select className="inp" value={beds} onChange={e => setBeds(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">Any</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <FLabel>STATUS</FLabel>
              <select className="inp" value={status} onChange={e => setStatus(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">All</option>
                {["Available","Coming Soon","Rented","Under Review"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <FLabel>MAX RENT ($)</FLabel>
              <input className="inp" type="number" value={maxRent} onChange={e => setMaxRent(e.target.value)} placeholder="No limit" />
            </div>
            <button
              onClick={clear}
              disabled={!hasFilters}
              style={{
                background: "none", border: `1px solid ${C.stone}`, color: hasFilters ? C.muted : C.subtle,
                padding: "10px 14px", borderRadius: 8, fontSize: 12, cursor: hasFilters ? "pointer" : "default",
                marginTop: 17, whiteSpace: "nowrap", transition: "border-color 0.2s",
              }}>
              <i className="fas fa-xmark" style={{ marginRight: 5 }} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ background: C.ivory, padding: "36px 28px 100px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {error && <div style={{ marginBottom: 24 }}><ErrorMsg msg={error} /></div>}
          {loading ? <PageLoader /> : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <p style={{ fontSize: 13, color: C.subtle }}>
                  <i className="fas fa-list" style={{ marginRight: 7, color: C.clay }} />
                  {properties.length} {properties.length === 1 ? "property" : "properties"} found
                  {hasFilters && <span style={{ color: C.terracotta, marginLeft: 8 }}>· Filtered</span>}
                </p>
                {hasFilters && (
                  <button onClick={clear} style={{ background: "none", border: "none", color: C.terracotta, fontSize: 13, cursor: "pointer" }}>
                    <i className="fas fa-rotate-left" style={{ marginRight: 5 }} />
                    Reset filters
                  </button>
                )}
              </div>
              {properties.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <i className="fas fa-house-circle-xmark" style={{ fontSize: 48, color: C.stone, display: "block", marginBottom: 20 }} />
                  <p style={{ fontFamily: F.serif, fontSize: 24, color: C.text, marginBottom: 12 }}>No properties match your search</p>
                  <p style={{ fontSize: 14, color: C.muted, marginBottom: 26 }}>Try adjusting or clearing your filters.</p>
                  <button className="btn-primary" onClick={clear} style={{ padding: "11px 28px" }}>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                  {properties.map(p => (
                    <PropertyCard key={p.id} prop={p} onClick={prop => navigate("PropertyDetail", prop)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PROPERTY DETAIL ───────────────────────────────────────────────────────────
export function PropertyDetailPage({ property, navigate }: { property: Property | null; navigate: (p: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", moveIn: "", occupants: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setDone(false); setError(""); setActiveImg(0);
    setForm({ name: "", email: "", phone: "", moveIn: "", occupants: "", message: "" });
  }, [property?.id]);

  if (!property) return (
    <div style={{ paddingTop: 140, textAlign: "center", minHeight: "80vh" }}>
      <i className="fas fa-house-circle-exclamation" style={{ fontSize: 48, color: C.stone, display: "block", marginBottom: 20 }} />
      <p style={{ fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 16 }}>Property not found.</p>
      <button className="btn-primary" onClick={() => navigate("Rentals")} style={{ padding: "11px 24px" }}>
        <i className="fas fa-arrow-left" style={{ marginRight: 8 }} />Back to Rentals
      </button>
    </div>
  );

  const fallback = PROPERTY_IMAGES[property.property_type] || PROPERTY_IMAGES["default"];
  const mainImg  = property.image_url || fallback;
  const gallery  = [mainImg, ...(property.gallery_images || []).filter(Boolean)];

  const submit = async () => {
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setSubmitting(true);
    try {
      await api.inquiries.create({
        property_id: property.id, property_title: property.title,
        full_name: form.name, email: form.email, phone: form.phone,
        desired_move_in_date: form.moveIn, number_of_occupants: form.occupants, message: form.message,
      });
      setDone(true);
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const amenityIcon = (a: string) => {
    const lower = a.toLowerCase();
    if (lower.includes("laundry") || lower.includes("washer")) return "fa-shirt";
    if (lower.includes("parking") || lower.includes("garage")) return "fa-car";
    if (lower.includes("air") || lower.includes("hvac")) return "fa-snowflake";
    if (lower.includes("pet")) return "fa-paw";
    if (lower.includes("kitchen")) return "fa-utensils";
    if (lower.includes("yard") || lower.includes("backyard") || lower.includes("garden")) return "fa-leaf";
    if (lower.includes("security")) return "fa-shield-halved";
    if (lower.includes("storage")) return "fa-box";
    if (lower.includes("basement")) return "fa-layer-group";
    if (lower.includes("fireplace")) return "fa-fire";
    if (lower.includes("hardwood") || lower.includes("floor")) return "fa-border-all";
    return "fa-circle-check";
  };

  return (
    <div style={{ paddingTop: 68, background: C.ivory, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 28px 100px" }}>
        <button onClick={() => navigate("Rentals")} style={{
          background: "none", border: "none", color: C.muted, fontSize: 13,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "8px 0",
        }}>
          <i className="fas fa-arrow-left" style={{ fontSize: 12 }} />
          Back to Rentals
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>
          {/* Main content */}
          <div>
            {/* Image gallery */}
            <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 12, position: "relative" }}>
              <img
                src={gallery[activeImg] || mainImg}
                alt={property.title}
                onError={e => { (e.target as HTMLImageElement).src = fallback; }}
                style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <StatusBadge status={property.availability_status} />
              </div>
            </div>
            {gallery.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                {gallery.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{
                    width: 72, height: 52, borderRadius: 8, overflow: "hidden", cursor: "pointer",
                    border: `2px solid ${activeImg === i ? C.gold : C.stone}`,
                    transition: "border-color 0.2s", flexShrink: 0,
                  }}>
                    <img
                      src={img}
                      alt={`${property.title} ${i + 1}`}
                      onError={e => { (e.target as HTMLImageElement).src = fallback; }}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Property info card */}
            <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "30px 28px" }}>
              <div style={{ marginBottom: 6 }}>
                <h1 style={{ fontFamily: F.serif, fontSize: 36, fontWeight: 400, color: C.text, lineHeight: 1.15, marginBottom: 8 }}>
                  {property.title}
                </h1>
                <p style={{ color: C.muted, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="fas fa-location-dot" style={{ color: C.clay }} />
                  {property.address_or_area && `${property.address_or_area} · `}{property.city}, {property.country}
                </p>
              </div>

              <p style={{ fontFamily: F.serif, fontSize: 32, color: C.espresso, margin: "18px 0" }}>
                ${property.monthly_rent.toLocaleString()}
                <span style={{ fontSize: 15, fontWeight: 300, color: C.muted, fontFamily: F.sans }}>/month</span>
              </p>

              <div style={{
                display: "flex", gap: 0,
                borderTop: `1px solid ${C.stone}`, borderBottom: `1px solid ${C.stone}`,
                padding: "16px 0", marginBottom: 28,
              }}>
                {[
                  { icon: "fa-bed", label: "Bedrooms", val: property.bedrooms },
                  { icon: "fa-shower", label: "Bathrooms", val: property.bathrooms },
                  { icon: "fa-home", label: "Type", val: property.property_type },
                ].map(({ icon, label, val }, i) => (
                  <div key={label} style={{
                    flex: 1, textAlign: "center",
                    borderLeft: i > 0 ? `1px solid ${C.stone}` : "none",
                    padding: "0 16px",
                  }}>
                    <i className={`fas ${icon}`} style={{ color: C.clay, fontSize: 16, display: "block", marginBottom: 6 }} />
                    <p style={{ fontSize: 10, color: C.subtle, letterSpacing: "0.12em", marginBottom: 4, fontWeight: 600 }}>{label.toUpperCase()}</p>
                    <p style={{ fontFamily: F.serif, fontSize: 18, color: C.text }}>{val}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 12 }}>Description</h3>
              <p style={{ color: C.muted, lineHeight: 1.85, marginBottom: 28, fontSize: 15 }}>{property.description}</p>

              {property.amenities.length > 0 && (
                <>
                  <h3 style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 14 }}>Amenities</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                    {property.amenities.map(a => (
                      <div key={a} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: C.ivory, border: `1px solid ${C.stone}`,
                        borderRadius: 8, padding: "10px 14px",
                      }}>
                        <i className={`fas ${amenityIcon(a)}`} style={{ color: C.gold, fontSize: 13, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.text }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.stone}` }}>
                <div style={{
                  background: C.sand, borderRadius: 10, padding: "16px 18px",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <i className="fas fa-file-contract" style={{ color: C.clay, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>Lease Information</p>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                      Lease terms, deposit requirements, and rental conditions will be provided upon inquiry and reviewed by Erowho Holdings Limited on a case-by-case basis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry form — sticky */}
          <div style={{ position: "sticky", top: 88 }}>
            <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "26px 22px", boxShadow: "0 8px 32px rgba(42,33,27,0.10)" }}>
              {done ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(200,168,107,0.12)", border: "2px solid rgba(200,168,107,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
                  }}>
                    <i className="fas fa-check" style={{ color: C.gold, fontSize: 20 }} />
                  </div>
                  <h3 style={{ fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 12 }}>Inquiry Received</h3>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.78 }}>
                    Thank you. Your rental inquiry has been received. Erowho Holdings Limited will review your request and contact you if the property is available and aligned with your rental needs.
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: F.serif, fontSize: 21, fontWeight: 400, color: C.text, marginBottom: 4 }}>
                    Inquire About This Rental
                  </h3>
                  <p style={{ fontSize: 13, color: C.muted, marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fas fa-home" style={{ color: C.clay, fontSize: 11 }} />
                    {property.title}
                  </p>
                  {error && <div style={{ marginBottom: 14 }}><ErrorMsg msg={error} /></div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input className="inp" placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input className="inp" type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="inp" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <div>
                      <label style={{ fontSize: 11, color: C.subtle, display: "block", marginBottom: 4, letterSpacing: "0.08em" }}>DESIRED MOVE-IN DATE</label>
                      <input className="inp" type="date" value={form.moveIn} onChange={e => setForm({ ...form, moveIn: e.target.value })} />
                    </div>
                    <input className="inp" placeholder="Number of occupants" value={form.occupants} onChange={e => setForm({ ...form, occupants: e.target.value })} />
                    <textarea className="inp" placeholder="Message (optional)" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} style={{ resize: "vertical" }} />
                    <button className="btn-primary" onClick={submit} disabled={submitting} style={{
                      padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      {submitting
                        ? <><Spinner size={16} color={C.espresso} /> Submitting…</>
                        : <><i className="fas fa-paper-plane" /> Submit Inquiry</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
export function AboutPage() {
  const sections = [
    {
      icon: "fa-building-columns",
      title: "Who We Are",
      copy: "Erowho Holdings Limited is a real estate investment and holding company focused on rental property ownership across Canada and the United States. We acquire, own, improve, and manage income-producing rental properties with a long-term view.\n\nOur goal is to build a stable rental portfolio while providing quality housing opportunities through properties owned, operated, or controlled by Erowho Holdings Limited.",
    },
    {
      icon: "fa-city",
      title: "What We Own",
      copy: "Our portfolio consists of single-family rental homes, townhomes, small multifamily properties, and select apartment units. We focus on residential rental assets in markets with strong fundamentals — places where people want to live, where rental demand is real, and where long-term ownership makes sense.",
    },
    {
      icon: "fa-chart-line",
      title: "How We Grow",
      copy: "Growth at Erowho Holdings Limited is deliberate, not opportunistic. We review properties carefully before acquiring them, and we hold them for the long term. We do not buy to flip, and we do not expand simply because capital is available.",
    },
    {
      icon: "fa-house-user",
      title: "Our Rental Approach",
      copy: "Tenants are not a transaction. We manage properties with the understanding that stable, well-maintained housing benefits both tenants and the portfolio. We aim to be responsible landlords — responsive, clear, and consistent.",
    },
    {
      icon: "fa-earth-americas",
      title: "Cross-Border Vision",
      copy: "Erowho Holdings Limited operates across Canada and the United States. This cross-border approach allows us to identify the best opportunities across two large rental markets and build a geographically diversified portfolio without losing operational discipline.",
    },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Header */}
      <section style={{
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -60, top: -60, width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,168,107,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Label light>About</Label>
          <h1 style={{ fontFamily: F.serif, fontSize: 52, fontWeight: 300, color: "#FAF6F0", lineHeight: 1.1, marginBottom: 22 }}>
            About Erowho Holdings Limited
          </h1>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(200,168,107,0.1)", border: "1px solid rgba(200,168,107,0.22)",
            borderRadius: 8, padding: "11px 16px",
          }}>
            <i className="fas fa-circle-info" style={{ color: C.gold }} />
            <p style={{ fontSize: 13, color: "rgba(200,168,107,0.9)" }}>
              We are not a brokerage, agent platform, or public rental marketplace. We do not list third-party properties.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ background: C.ivory }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "68px 28px 100px" }}>
          {sections.map(({ icon, title, copy }, idx) => (
            <div key={title} style={{ marginBottom: 52, paddingBottom: 52, borderBottom: idx < sections.length - 1 ? `1px solid ${C.stone}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "rgba(200,168,107,0.1)", border: "1px solid rgba(200,168,107,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={`fas ${icon}`} style={{ color: C.gold, fontSize: 16 }} />
                </div>
                <h2 style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 300, color: C.text }}>{title}</h2>
              </div>
              {copy.split("\n\n").map((p, i) => (
                <p key={i} style={{ color: C.muted, lineHeight: 1.88, fontSize: 15.5, marginBottom: 12 }}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
export function PortfolioPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.properties.list().then(ps => { setProperties(ps); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 68 }}>
      <section style={{
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Label light>EROWHO HOLDINGS</Label>
          <h1 style={{ fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 14 }}>Our Portfolio</h1>
          <p style={{ color: "rgba(215,199,181,0.65)", maxWidth: 540, lineHeight: 1.78, fontSize: 15 }}>
            As Erowho Holdings Limited grows, this page showcases rental assets held within our long-term portfolio across Canada and the United States.
          </p>
        </div>
      </section>

      <div style={{ background: C.ivory, padding: "56px 28px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {loading ? <PageLoader /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
              {properties.map(p => (
                <div key={p.id} style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ height: 190, overflow: "hidden", position: "relative" }}>
                    <PropImage property={p} height={190} />
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <StatusBadge status={p.availability_status} />
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <h3 style={{ fontFamily: F.serif, fontSize: 19, fontWeight: 500, color: C.text, marginBottom: 6 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="fas fa-location-dot" style={{ color: C.clay, fontSize: 11 }} />
                      {p.city}, {p.country}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                      {[
                        { icon: "fa-home", label: p.property_type },
                        { icon: "fa-bed", label: `${p.bedrooms} bed` },
                        { icon: "fa-shower", label: `${p.bathrooms} bath` },
                      ].map(({ icon, label }) => (
                        <span key={label} style={{
                          fontSize: 11.5, color: C.muted,
                          background: C.ivory, padding: "3px 10px", borderRadius: 20,
                          border: `1px solid ${C.stone}`, display: "flex", alignItems: "center", gap: 5,
                        }}>
                          <i className={`fas ${icon}`} style={{ fontSize: 9, color: C.clay }} />
                          {label}
                        </span>
                      ))}
                    </div>
                    <div style={{ paddingTop: 12, borderTop: `1px solid ${C.stone}` }}>
                      <p style={{ fontSize: 10, color: C.clay, letterSpacing: "0.12em", fontWeight: 600 }}>
                        OWNED BY EROWHO HOLDINGS
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PROCESS ───────────────────────────────────────────────────────────────────
export function ProcessPage() {
  const steps = [
    { icon: "fa-magnifying-glass-location", n: "01", title: "Identify Markets", desc: "We research Canadian and U.S. rental markets where demand, fundamentals, and long-term ownership conditions align." },
    { icon: "fa-file-magnifying-glass", n: "02", title: "Review Property Fundamentals", desc: "We assess each potential acquisition against our Property Review Lens — evaluating rental demand, condition, cash flow, and long-term suitability." },
    { icon: "fa-file-signature", n: "03", title: "Acquire Rental Assets", desc: "We acquire properties that meet our criteria. We do not move quickly simply because a property is available." },
    { icon: "fa-screwdriver-wrench", n: "04", title: "Prepare or Improve", desc: "Before listing, we ensure the property is in suitable condition. Where improvements are warranted, we make them." },
    { icon: "fa-list-check", n: "05", title: "List for Rent", desc: "Once ready, the property is listed and made available to prospective tenants who inquire directly through Erowho Holdings Limited." },
    { icon: "fa-people-roof", n: "06", title: "Manage Responsibly", desc: "We manage properties with care — handling maintenance, communications, and tenancy in a straightforward, professional manner." },
    { icon: "fa-clock-rotate-left", n: "07", title: "Hold for the Long Term", desc: "We do not exit positions opportunistically. Our model is built around long-term ownership, stable income, and durable portfolio growth." },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      <section style={{
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Label light>How We Operate</Label>
          <h1 style={{ fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 14 }}>Our Process</h1>
          <p style={{ color: "rgba(215,199,181,0.65)", fontSize: 15, lineHeight: 1.78 }}>
            From identifying a market to holding a property long-term — here is how Erowho Holdings Limited approaches rental property ownership.
          </p>
        </div>
      </section>

      <div style={{ background: C.ivory, padding: "68px 28px 100px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {steps.map(({ icon, n, title, desc }, i) => (
            <div key={n} style={{
              display: "flex", gap: 28, marginBottom: 44, paddingBottom: 44,
              borderBottom: i < steps.length - 1 ? `1px solid ${C.stone}` : "none",
            }}>
              <div style={{
                flexShrink: 0, width: 56, height: 56, borderRadius: "50%",
                background: "#FFF", border: `2px solid ${C.stone}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <i className={`fas ${icon}`} style={{ color: C.gold, fontSize: 18 }} />
                <span style={{
                  position: "absolute", top: -8, right: -8,
                  width: 22, height: 22, borderRadius: "50%",
                  background: C.gold, color: C.espresso,
                  fontSize: 9, fontFamily: F.mono, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{n}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text, marginBottom: 10 }}>{title}</h2>
                <p style={{ color: C.muted, lineHeight: 1.88, fontSize: 15 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setSubmitting(true);
    try {
      await api.inquiries.create({ full_name: form.name, email: form.email, phone: form.phone, message: `[${form.type || "General"}] ${form.message}` });
      setDone(true);
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <section style={{
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Label light>Get in Touch</Label>
          <h1 style={{ fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 10 }}>
            Contact Erowho Holdings Limited
          </h1>
          <p style={{ color: "rgba(215,199,181,0.65)", fontSize: 15 }}>
            Canada &amp; United States operations
          </p>
        </div>
      </section>

      <div style={{ background: C.ivory, padding: "68px 28px 100px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "rgba(200,168,107,0.12)", border: "2px solid rgba(200,168,107,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
              }}>
                <i className="fas fa-check" style={{ color: C.gold, fontSize: 22 }} />
              </div>
              <h2 style={{ fontFamily: F.serif, fontSize: 30, color: C.text, marginBottom: 14 }}>Message Received</h2>
              <p style={{ color: C.muted, lineHeight: 1.78, fontSize: 15 }}>
                Thank you for reaching out to Erowho Holdings Limited. We will review your inquiry and respond accordingly.
              </p>
            </div>
          ) : (
            <div style={{ background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(42,33,27,0.07)" }}>
              <h2 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text, marginBottom: 22 }}>Send a Message</h2>
              {error && <div style={{ marginBottom: 16 }}><ErrorMsg msg={error} /></div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="inp" placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="inp" type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="inp" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ cursor: "pointer" }}>
                  <option value="">Inquiry type</option>
                  <option>Rental inquiry</option>
                  <option>General question</option>
                  <option>Portfolio / company inquiry</option>
                  <option>Other</option>
                </select>
                <textarea className="inp" placeholder="Message *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} style={{ resize: "vertical" }} />
                <button className="btn-primary" onClick={submit} disabled={submitting} style={{
                  padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {submitting
                    ? <><Spinner size={16} color={C.espresso} /> Sending…</>
                    : <><i className="fas fa-paper-plane" /> Send Message</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
