import React, { useState, useEffect } from "react";
import { C, F, GLOBAL_CSS } from "./tokens";
import { api, Property } from "./api";
import { Navbar, Footer } from "./components/ui";
import {
  HomePage, RentalsPage, PropertyDetailPage,
  AboutPage, PortfolioPage, ProcessPage, ContactPage,
} from "./pages/public";
import { AdminLoginPage, AdminDashboard, AdminPropertyForm } from "./pages/admin";

type Page =
  | "Home" | "Rentals" | "PropertyDetail" | "About"
  | "Portfolio" | "Process" | "Contact"
  | "AdminLogin" | "AdminDashboard" | "AdminAddProperty" | "AdminEditProperty"
  | "NotFound";

const PUBLIC_PAGES: Page[] = [
  "Home", "Rentals", "PropertyDetail", "About",
  "Portfolio", "Process", "Contact", "NotFound",
];

export interface RentalFilters {
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

function NotFoundPage({ navigate }: { navigate: (p: string) => void }) {
  return (
    <div style={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 28px", textAlign: "center",
      background: C.ivory,
    }}>
      <i className="fas fa-house-chimney" style={{ fontSize: 52, color: C.stone, marginBottom: 28 }} />
      <h1 style={{ fontFamily: F.serif, fontSize: 42, fontWeight: 300, color: C.text, marginBottom: 14 }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 420, marginBottom: 36 }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn-primary" onClick={() => navigate("Home")} style={{ padding: "13px 28px" }}>
          Back to Home
        </button>
        <button className="btn-outline" onClick={() => navigate("Rentals")} style={{ padding: "13px 28px" }}>
          Browse Rentals
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage]                 = useState<Page>("Home");
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [editTarget, setEditTarget]     = useState<Property | null>(null);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [rentalFilters, setRentalFilters] = useState<RentalFilters>({});

  // Verify stored JWT on mount
  useEffect(() => {
    if (api.hasToken()) {
      api.auth.verify()
        .then(() => setIsAdmin(true))
        .catch(() => { api.clearToken(); setIsAdmin(false); });
    }
  }, []);

  const navigate = (p: string, data?: unknown) => {
    const target = p as Page;
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (data && target === "PropertyDetail") setSelectedProp(data as Property);
    if (target === "Rentals") setRentalFilters((data as RentalFilters) || {});
  };

  const handleLogout = () => {
    api.clearToken();
    setIsAdmin(false);
    navigate("Home");
  };

  const isPublicPage = PUBLIC_PAGES.includes(page);
  const isAdminPage  = !isPublicPage;

  // Redirect unauthenticated users away from admin pages
  if (isAdminPage && page !== "AdminLogin" && !isAdmin) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <AdminLoginPage navigate={navigate} onLogin={() => setIsAdmin(true)} />
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Public layout */}
      {isPublicPage && (
        <>
          <Navbar currentPage={page} navigate={navigate} />
          {page === "Home"           && <HomePage navigate={navigate} />}
          {page === "Rentals"        && <RentalsPage navigate={navigate} initialFilters={rentalFilters} />}
          {page === "PropertyDetail" && <PropertyDetailPage property={selectedProp} navigate={navigate} />}
          {page === "About"          && <AboutPage />}
          {page === "Portfolio"      && <PortfolioPage />}
          {page === "Process"        && <ProcessPage />}
          {page === "Contact"        && <ContactPage />}
          {page === "NotFound"       && <NotFoundPage navigate={navigate} />}
          <Footer navigate={navigate} />
        </>
      )}

      {/* Admin layout */}
      {page === "AdminLogin" && (
        <AdminLoginPage navigate={navigate} onLogin={() => setIsAdmin(true)} />
      )}
      {page === "AdminDashboard" && isAdmin && (
        <AdminDashboard navigate={navigate} onLogout={handleLogout} setEditTarget={setEditTarget} />
      )}
      {page === "AdminAddProperty" && isAdmin && (
        <AdminPropertyForm editTarget={null} navigate={navigate} onLogout={handleLogout} />
      )}
      {page === "AdminEditProperty" && isAdmin && (
        <AdminPropertyForm editTarget={editTarget} navigate={navigate} onLogout={handleLogout} />
      )}
    </>
  );
}
