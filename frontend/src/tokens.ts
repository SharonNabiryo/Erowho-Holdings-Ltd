// ── Color Palette ─────────────────────────────────────────────────────────────
export const C = {
  // Light backgrounds (main public site)
  ivory:      "#F7F1E8",  // Warm Ivory — main background
  sand:       "#E8D8C3",  // Soft Sand — section breaks
  cream:      "#FAF6F0",  // Cream — light card surfaces
  stone:      "#D7C7B5",  // Stone Beige — borders, dividers

  // Dark surfaces (dark sections, footer, admin)
  espresso:   "#2A211B",  // Deep Espresso — text, footer, dark overlays
  charcoal:   "#3A3028",  // Charcoal Brown — dark hero sections
  darkCard:   "#4A3E34",  // slightly lighter dark card surface
  darkBorder: "#5A4E44",  // dark section borders

  // Accent colors
  gold:       "#C8A86B",  // Champagne Gold — buttons, premium highlights
  clay:       "#B89B7B",  // Clay Taupe — warmth, secondary accents
  terracotta: "#B66E4F",  // Muted Terracotta — selective highlights, CTAs
  olive:      "#6F7564",  // Olive Gray — secondary text

  // Text
  text:       "#2A211B",  // Deep Espresso — body text on light bg
  muted:      "#7A6A5C",  // warm muted text
  subtle:     "#A09080",  // subtle/placeholder text

  // Legacy aliases (keeps older references working)
  graphite:   "#2A211B",
  charcoalOld:"#3A3028",
  brass:      "#C8A86B",
  champagne:  "#E8D8C3",
  taupe:      "#B89B7B",
  slate:      "#6F7564",
  bronze:     "#B66E4F",
  bodyDark:   "#7A6A5C",
  lBg:        "#F7F1E8",
  lSurface:   "#FAF6F0",
  lCard:      "#FFFFFF",
  lBorder:    "#D7C7B5",
  lText:      "#2A211B",
  lMuted:     "#7A6A5C",
  lSubtle:    "#A09080",
};

// ── Typography ────────────────────────────────────────────────────────────────
export const F = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'DM Mono', monospace",
};

// ── Status Badge Styles ───────────────────────────────────────────────────────
export const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  "Available":    { bg: "#EBF4E8", text: "#3A7A37", border: "#B8D4B5" },
  "Coming Soon":  { bg: "#FBF5E8", text: "#8A6A2A", border: "#E0D0A0" },
  "Rented":       { bg: "#F2EDE8", text: "#8C6A4A", border: "#D4C0A8" },
  "Under Review": { bg: "#EEF2F6", text: "#5A7A9A", border: "#B8CCDC" },
};

// ── Unsplash Fallback Images by Property Type ──────────────────────────────────
export const PROPERTY_IMAGES: Record<string, string> = {
  "Townhome":           "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
  "Single-Family Home": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  "Duplex":             "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "Apartment":          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "Condo":              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "Multifamily":        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "default":            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
};

export const HERO_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85";

// ── Global CSS ────────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #F7F1E8; color: #2A211B; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: 'DM Sans', system-ui, sans-serif; }

  /* ── Buttons ── */
  .btn-primary {
    background: #C8A86B; color: #2A211B; border: none; cursor: pointer;
    font-weight: 500; font-size: 14px; letter-spacing: 0.02em;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
    border-radius: 8px;
  }
  .btn-primary:hover { background: #B89B7B; box-shadow: 0 4px 16px rgba(200,168,107,0.3); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  /* keep old class names working */
  .btn-brass { background: #C8A86B; color: #2A211B; border: none; cursor: pointer; font-weight: 500; transition: background 0.2s, transform 0.12s; border-radius: 8px; }
  .btn-brass:hover { background: #B89B7B; }
  .btn-brass:active { transform: scale(0.98); }
  .btn-brass:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-outline {
    background: transparent; border: 1.5px solid #D7C7B5; color: #2A211B; cursor: pointer;
    font-size: 14px; transition: border-color 0.2s, background 0.2s; border-radius: 8px;
  }
  .btn-outline:hover { border-color: #C8A86B; background: rgba(200,168,107,0.06); }

  .btn-outline-dark {
    background: transparent; border: 1.5px solid rgba(215,199,181,0.3); color: #FAF6F0; cursor: pointer;
    font-size: 14px; transition: border-color 0.2s, background 0.2s; border-radius: 8px;
  }
  .btn-outline-dark:hover { border-color: #C8A86B; color: #C8A86B; }

  .btn-light { background: transparent; border: 1px solid #D7C7B5; color: #2A211B; cursor: pointer; transition: border-color 0.2s; border-radius: 8px; }
  .btn-light:hover { border-color: #C8A86B; }

  .btn-danger { background: transparent; border: 1px solid #d4a8a0; color: #c07070; cursor: pointer; transition: background 0.2s; border-radius: 6px; }
  .btn-danger:hover { background: rgba(180,80,80,0.08); }

  /* ── Inputs ── */
  .inp {
    background: #fff; border: 1.5px solid #D7C7B5; color: #2A211B;
    padding: 10px 14px; border-radius: 8px; font-size: 14px; width: 100%;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .inp:focus { border-color: #C8A86B; box-shadow: 0 0 0 3px rgba(200,168,107,0.15); }
  .inp::placeholder { color: #A09080; }

  .inp-dark { background: #4A3E34; border: 1.5px solid #5A4E44; color: #FAF6F0; }
  .inp-dark:focus { border-color: #C8A86B; }
  .inp-dark::placeholder { color: #8A7A6A; }

  /* ── Property Card ── */
  .pcard {
    background: #fff; border: 1px solid #D7C7B5; border-radius: 14px;
    overflow: hidden; cursor: pointer;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .pcard:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(42,33,27,0.14); border-color: #C8A86B; }
  .pcard:hover .pcard-img img { transform: scale(1.05); }
  .pcard-img img { transition: transform 0.5s ease; }

  /* ── Nav ── */
  .nav-lnk { background: none; border: none; cursor: pointer; transition: color 0.18s; padding: 4px 0; font-size: 13.5px; }

  /* ── Admin table row ── */
  tr.arow:hover td { background: rgba(200,168,107,0.05); }

  /* ── Animations ── */
  .fade-in { animation: fadeIn 0.35s ease both; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .spinner { width: 20px; height: 20px; border: 2px solid rgba(200,168,107,0.3); border-top-color: #C8A86B; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Glass card ── */
  .glass-card {
    background: rgba(250,246,240,0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(215,199,181,0.6);
    border-radius: 14px;
  }

  /* ── Section label ── */
  .section-label {
    font-size: 10px; letter-spacing: 0.22em; font-weight: 500; text-transform: uppercase;
  }
`;
