import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Inbox, History } from 'lucide-react';

interface SurveysSectionProps {
  onBack: () => void;
}

const SurveysSection: React.FC<SurveysSectionProps> = ({ onBack }) => {
  const [viewHistory, setViewHistory] = useState(false);

  return (
    <div className="container" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> Volver al Inicio
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass" style={{ width: '100%', maxWidth: '800px', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        <AnimatePresence mode="wait">
          {!viewHistory ? (
            <motion.div key="active" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '50%' }}>
                <Inbox size={64} color="var(--text-muted)" />
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>No hay encuestas activas</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto' }}>Por el momento no necesitamos tu opinión para nuevos proyectos. ¡Vuelve pronto!</p>
              </div>
              <button onClick={() => setViewHistory(true)} className="liquid-glass hover-glass" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '100px', border: 'none', color: 'white', cursor: 'pointer' }}>
                <History size={18} /> Ver Historial
              </button>
            </motion.div>
          ) : (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '50%' }}>
                <History size={64} color="var(--text-muted)" />
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>Historial Vacío</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto' }}>Todavía no se ha completado ninguna encuesta en este año lectivo.</p>
              </div>
              <button onClick={() => setViewHistory(false)} style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Volver a Encuestas Activas
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default SurveysSection;
