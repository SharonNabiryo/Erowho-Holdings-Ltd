import React, { useState, useEffect } from "react";
import { GLOBAL_CSS } from "./tokens";
import { api, Property } from "./api";
import { Navbar, Footer } from "./components/ui";
import { HomePage, RentalsPage, PropertyDetailPage, AboutPage, PortfolioPage, ProcessPage, ContactPage } from "./pages/public";
import { AdminLoginPage, AdminDashboard, AdminPropertyForm } from "./pages/admin";

type Page =
  | "Home" | "Rentals" | "PropertyDetail" | "About"
  | "Portfolio" | "Process" | "Contact"
  | "AdminLogin" | "AdminDashboard" | "AdminAddProperty" | "AdminEditProperty";

const PUBLIC_PAGES: Page[] = ["Home", "Rentals", "PropertyDetail", "About", "Portfolio", "Process", "Contact"];

export interface RentalFilters {
  q?: string;
  country?: string;
  property_type?: string;
  bedrooms?: string;
  status?: string;
  max_rent?: string;
}

export default function App() {
  const [page, setPage]             = useState<Page>("Home");
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [rentalFilters, setRentalFilters] = useState<RentalFilters>({});

  // Verify JWT on mount
  useEffect(() => {
    if (api.hasToken()) {
      api.auth.verify()
        .then(() => setIsAdmin(true))
        .catch(() => { api.clearToken(); setIsAdmin(false); });
    }
  }, []);

  const navigate = (p: string, data?: any) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (data && p === "PropertyDetail") setSelectedProp(data as Property);
    if (data && p === "Rentals") { setRentalFilters(data as RentalFilters); }
    if (!data && p === "Rentals") setRentalFilters({});
  };

  const handleLogout = () => {
    api.clearToken();
    setIsAdmin(false);
    navigate("Home");
  };

  const isPublicPage = PUBLIC_PAGES.includes(page);
  const isAdminPage  = !isPublicPage;

  // Guard admin pages
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
