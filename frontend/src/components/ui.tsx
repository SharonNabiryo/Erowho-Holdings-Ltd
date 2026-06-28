import React, { useState, useEffect } from "react";
import { C, F, STATUS_STYLE } from "../tokens";
import { PropImage } from "../illustrations";
import type { Property } from "../api";

// ── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["Under Review"];
  return (
    <span style={{
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      padding: "3px 11px", borderRadius: 20, fontSize: 11,
      letterSpacing: "0.06em", fontWeight: 600, display: "inline-block",
      lineHeight: 1.8, whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 24, color = C.gold }: { size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  );
}

// ── Page loading state ────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
      <Spinner size={32} />
    </div>
  );
}

// ── Error message ─────────────────────────────────────────────────────────────
export function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div style={{
      background: "#FDF0EE", border: "1px solid #DDBBBB", borderRadius: 8,
      padding: "12px 16px", color: "#9A4040", fontSize: 14,
    }}>
      <i className="fas fa-circle-exclamation" style={{ marginRight: 8 }} />
      {msg}
    </div>
  );
}

// ── Property Card ─────────────────────────────────────────────────────────────
export function PropertyCard({ prop, onClick }: { prop: Property; onClick: (p: Property) => void }) {
  return (
    <div className="pcard fade-in" onClick={() => onClick(prop)}>
      <div className="pcard-img" style={{ height: 220, overflow: "hidden", position: "relative" }}>
        <PropImage property={prop} height={220} />
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <StatusBadge status={prop.availability_status} />
        </div>
      </div>
      <div style={{ padding: "20px 22px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{
            fontFamily: F.serif, fontSize: 20, fontWeight: 500, color: C.text,
            lineHeight: 1.2, flex: 1, marginRight: 10,
          }}>
            {prop.title}
          </h3>
        </div>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
          <i className="fas fa-location-dot" style={{ color: C.clay, fontSize: 11 }} />
          {prop.city}, {prop.country}
        </p>
        <div style={{ display: "flex", gap: 18, marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
            <i className="fas fa-bed" style={{ color: C.clay, fontSize: 11 }} />
            {prop.bedrooms} {prop.bedrooms === 1 ? "bed" : "beds"}
          </span>
          <span style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
            <i className="fas fa-shower" style={{ color: C.clay, fontSize: 11 }} />
            {prop.bathrooms} {prop.bathrooms === 1 ? "bath" : "baths"}
          </span>
          <span style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
            <i className="fas fa-home" style={{ color: C.clay, fontSize: 11 }} />
            {prop.property_type}
          </span>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>
          {prop.description.slice(0, 105)}{prop.description.length > 105 ? "…" : ""}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${C.stone}` }}>
          <span style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 500, color: C.espresso }}>
            ${prop.monthly_rent.toLocaleString()}
            <span style={{ fontSize: 13, fontWeight: 300, color: C.muted, fontFamily: F.sans }}>/mo</span>
          </span>
          <span style={{ color: C.gold, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
            View Details <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar({
  currentPage,
  navigate,
  transparent = false,
}: {
  currentPage: string;
  navigate: (p: string) => void;
  transparent?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isAtTop = !scrolled;
  const onHero  = currentPage === "Home" && isAtTop;

  const links: [string, string][] = [
    ["Home", "Home"], ["Rentals", "Rentals"], ["About", "About"],
    ["Portfolio", "Portfolio"], ["Process", "Our Process"], ["Contact", "Contact"],
  ];

  const navBg = onHero
    ? "rgba(42,33,27,0.15)"
    : scrolled
      ? "rgba(250,246,240,0.97)"
      : "rgba(250,246,240,0.95)";

  const navBorder = onHero
    ? "rgba(215,199,181,0.15)"
    : "rgba(215,199,181,0.8)";

  const logoColor = onHero ? "#FAF6F0" : C.espresso;
  const logoSub   = onHero ? "rgba(215,199,181,0.8)" : C.clay;
  const linkColor = onHero ? "rgba(250,246,240,0.85)" : C.muted;
  const linkActive = onHero ? "#FAF6F0" : C.espresso;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: navBg,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${navBorder}`,
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto", padding: "0 28px",
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div onClick={() => navigate("Home")} style={{ cursor: "pointer" }}>
          <span style={{
            fontFamily: F.serif, fontSize: 21, fontWeight: 400, color: logoColor,
            letterSpacing: "0.03em", display: "block", lineHeight: 1.2,
            transition: "color 0.3s",
          }}>
            Erowho Holdings Limited
          </span>
          <span style={{ fontSize: 8.5, color: logoSub, letterSpacing: "0.22em", transition: "color 0.3s" }}>
            RENTAL PROPERTY HOLDINGS
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", gap: 26 }}>
            {links.map(([page, label]) => (
              <button key={page} className="nav-lnk" onClick={() => navigate(page)}
                style={{
                  color: currentPage === page ? linkActive : linkColor,
                  borderBottom: `1.5px solid ${currentPage === page ? C.gold : "transparent"}`,
                  paddingBottom: 2, letterSpacing: "0.02em",
                  fontWeight: currentPage === page ? 500 : 400,
                  transition: "color 0.2s",
                }}>
                {label}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("Rentals")}
            style={{ padding: "9px 20px", fontSize: 13, letterSpacing: "0.03em" }}>
            View Rentals
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer({ navigate }: { navigate: (p: string) => void }) {
  const links: [string, string][] = [
    ["Home","Home"],["Rentals","Rentals"],["About","About"],
    ["Portfolio","Portfolio"],["Process","Our Process"],["Contact","Contact"],
  ];
  return (
    <footer style={{ background: C.espresso, padding: "60px 28px 32px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 54,
          marginBottom: 44, paddingBottom: 40,
          borderBottom: `1px solid rgba(215,199,181,0.12)`,
        }}>
          <div>
            <p style={{ fontFamily: F.serif, fontSize: 22, color: "#FAF6F0", marginBottom: 3 }}>
              Erowho Holdings Limited
            </p>
            <p style={{ fontSize: 9, color: C.clay, letterSpacing: "0.22em", marginBottom: 16 }}>
              RENTAL PROPERTY HOLDINGS
            </p>
            <p style={{ fontSize: 13.5, color: "rgba(215,199,181,0.7)", lineHeight: 1.82, maxWidth: 340 }}>
              Acquiring, owning, and managing income-producing rental properties across Canada and the United States for the long term.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
              {[
                ["fas fa-map-marker-alt", "Canada & United States"],
                ["fas fa-building", "Residential Rentals"],
              ].map(([icon, label]) => (
                <span key={label} style={{ fontSize: 12, color: "rgba(200,168,107,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                  <i className={icon} style={{ fontSize: 10 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, color: C.clay, letterSpacing: "0.18em", marginBottom: 16, fontWeight: 500 }}>
              NAVIGATE
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(([page, label]) => (
                <button key={page} className="nav-lnk" onClick={() => navigate(page)}
                  style={{ color: "rgba(215,199,181,0.65)", textAlign: "left", fontSize: 13.5 }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(215,199,181,0.65)")}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, color: C.clay, letterSpacing: "0.18em", marginBottom: 16, fontWeight: 500 }}>
              RENTALS
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Rentals", "Available Properties"],
                ["Rentals", "Coming Soon"],
                ["Contact", "Rental Inquiries"],
                ["AdminLogin", "Admin Login"],
              ].map(([page, label]) => (
                <button key={label} className="nav-lnk" onClick={() => navigate(page)}
                  style={{
                    color: page === "AdminLogin" ? "rgba(215,199,181,0.25)" : "rgba(215,199,181,0.65)",
                    textAlign: "left", fontSize: page === "AdminLogin" ? 11 : 13.5,
                    letterSpacing: page === "AdminLogin" ? "0.08em" : "normal",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={e => (e.currentTarget.style.color = page === "AdminLogin" ? "rgba(215,199,181,0.25)" : "rgba(215,199,181,0.65)")}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "rgba(215,199,181,0.4)", lineHeight: 1.85, maxWidth: 860, marginBottom: 14 }}>
          Erowho Holdings Limited is a real estate investment and holding company. Rental availability is limited to properties owned, operated, or controlled by Erowho Holdings Limited. Website content is for informational purposes only and does not constitute brokerage, financial, legal, or investment advice.
        </p>
        <p style={{ fontSize: 11, color: "rgba(215,199,181,0.25)" }}>
          © {new Date().getFullYear()} Erowho Holdings Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
