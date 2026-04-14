import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Calendar, FileText, MessageSquare, Menu, X } from "lucide-react";
import HeroSection from "./components/HeroSection";
import HomeSection from "./components/HomeSection";
import CalendarSection from "./components/CalendarSection";
import DocumentsSection from "./components/DocumentsSection";
import ContactSection from "./components/ContactSection";
import AnnouncementsSection from "./components/AnnouncementsSection";
import SurveysSection from "./components/SurveysSection";
import AboutUsSection from "./components/AboutUsSection";
import WorkWithUsSection from "./components/WorkWithUsSection";

function App() {
  const [activeTab, setActiveTab] = useState("hero");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Basic styling for the nav
  const navStyles = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 50,
    padding: "1rem",
    boxSizing: "border-box" as const,
  };

  const navInner = {
    maxWidth: "800px",
    margin: "0 auto",
    borderRadius: "100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
  };

  const navLinks = {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  };

  const navBtn = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "none",
    border: "none",
    fontSize: "1rem",
    padding: "0.5rem",
    borderRadius: "8px",
  };

  return (
    <>
      <div className="animated-bg">
        <div className="light-beam red-beam"></div>
        <div className="light-beam blue-beam"></div>
        <div className="light-beam yellow-beam"></div>
      </div>

      {activeTab !== "hero" && (
        <nav style={navStyles}>
          <div className="liquid-glass hover-glass" style={navInner}>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.4rem",
                letterSpacing: "-1px",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("home")}
            >
              CE
            </div>

            <div style={navLinks} className="desktop-nav">
              <button style={navBtn} onClick={() => setActiveTab("home")}>
                <Home size={18} /> <span className="hide-mobile">Inicio</span>
              </button>
              <button style={navBtn} onClick={() => setActiveTab("calendar")}>
                <Calendar size={18} />{" "}
                <span className="hide-mobile">Calendario</span>
              </button>
              <button style={navBtn} onClick={() => setActiveTab("documents")}>
                <FileText size={18} />{" "}
                <span className="hide-mobile">Actas</span>
              </button>
              <button style={navBtn} onClick={() => setActiveTab("contact")}>
                <MessageSquare size={18} />{" "}
                <span className="hide-mobile">Contacto</span>
              </button>
            </div>
          </div>
          <style>{`
            @media (max-width: 600px) {
              .hide-mobile { display: none; }
              .desktop-nav { gap: 0.5rem !important; }
            }
          `}</style>
        </nav>
      )}

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          zIndex: 10,
          paddingTop: activeTab === "hero" ? 0 : "80px",
          boxSizing: "border-box",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {activeTab === "hero" && (
              <HeroSection onEnter={() => setActiveTab("home")} />
            )}
            {activeTab === "home" && (
              <HomeSection
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                navigateTo={setActiveTab}
              />
            )}
            {activeTab === "calendar" && <CalendarSection />}
            {activeTab === "documents" && <DocumentsSection />}
            {activeTab === "contact" && <ContactSection />}
            {activeTab === "anuncios" && <AnnouncementsSection onBack={() => setActiveTab("home")} />}
            {activeTab === "encuestas" && <SurveysSection onBack={() => setActiveTab("home")} />}
            {activeTab === "quienes-somos" && <AboutUsSection onBack={() => setActiveTab("home")} />}
            {activeTab === "trabaja-con-nosotros" && <WorkWithUsSection onBack={() => setActiveTab("home")} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
