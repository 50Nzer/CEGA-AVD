import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Calendar, FileText, MessageSquare } from "lucide-react";
import HeroSection from "./components/HeroSection";
import HomeSection from "./components/HomeSection";
import CalendarSection from "./components/CalendarSection";
import DocumentsSection from "./components/DocumentsSection";
import ContactSection from "./components/ContactSection";
import AnnouncementsSection from "./components/AnnouncementsSection";
import SurveysSection from "./components/SurveysSection";
import AboutUsSection from "./components/AboutUsSection";
import WorkWithUsSection from "./components/WorkWithUsSection";
import AdminPanel from "./components/AdminPanel";

export interface CurrentUser {
  nombre: string;
  apellido: string;
  curso: string;
  division: string;
}

function App() {
  const [activeTab, setActiveTab] = useState("hero");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showDesignerMenu, setShowDesignerMenu] = useState(false);

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
    color: "white",
    cursor: "pointer",
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
                color: "white",
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
                setCurrentUser={setCurrentUser}
              />
            )}
            {activeTab === "calendar" && <CalendarSection />}
            {activeTab === "documents" && <DocumentsSection />}
            {activeTab === "contact" && <ContactSection currentUser={currentUser} />}
            {activeTab === "anuncios" && <AnnouncementsSection onBack={() => setActiveTab("home")} />}
            {activeTab === "encuestas" && <SurveysSection onBack={() => setActiveTab("home")} />}
            {activeTab === "quienes-somos" && <AboutUsSection onBack={() => setActiveTab("home")} />}
            {activeTab === "trabaja-con-nosotros" && <WorkWithUsSection onBack={() => setActiveTab("home")} />}
            {activeTab === "admin" && <AdminPanel onBack={() => setActiveTab("home")} />}
          </motion.div>
        </AnimatePresence>

        {/* Designer Credit Footer */}
        {activeTab !== "admin" && (
          <div style={{ position: "relative", textAlign: "center", padding: "1.5rem 1rem 2rem" }}>
            <button
              onClick={() => setShowDesignerMenu(!showDesignerMenu)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                fontFamily: "inherit",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              Designed by Agustín Vega
            </button>

            {showDesignerMenu && (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setShowDesignerMenu(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 0.5rem)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                    background: "rgba(10,10,20,0.96)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "18px",
                    padding: "0.5rem",
                    minWidth: "250px",
                    boxShadow: "0 -20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
                  }}
                >
                  <a
                    href="https://avportafolios.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowDesignerMenu(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      padding: "0.875rem 1rem",
                      borderRadius: "12px",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "1rem" }}>🌐</span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Ver Portafolio</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", marginTop: "1px" }}>avportafolios.web.app</div>
                    </div>
                  </a>

                  <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "0.25rem 0.5rem" }} />

                  <button
                    onClick={() => { setShowDesignerMenu(false); setActiveTab("admin"); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      padding: "0.875rem 1rem",
                      borderRadius: "12px",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "1rem" }}>⚙️</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Modo Admin</div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>Requiere autenticación</div>
                    </div>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
