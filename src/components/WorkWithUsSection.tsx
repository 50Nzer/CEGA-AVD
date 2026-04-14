import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Camera } from 'lucide-react';

interface WorkWithUsProps {
  onBack: () => void;
}

const WorkWithUsSection: React.FC<WorkWithUsProps> = ({ onBack }) => {
  return (
    <div className="container" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> Volver al Inicio
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring' }} className="liquid-glass-strong hover-glass" style={{ width: '100%', maxWidth: '800px', padding: '4rem 2rem', borderRadius: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Accent */}
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '100%', background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #a78bfa, #c084fc)', padding: '1.5rem', borderRadius: '50%', boxShadow: '0 10px 30px rgba(167, 139, 250, 0.3)' }}>
            <Rocket size={48} color="white" />
          </div>
          
          <div>
            <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem', lineHeight: 1.1 }}>Sumate al equipo.</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              Si estás comprometido con el colegio y quieres representar verdaderamente a los estudiantes, te estamos buscando.
            </p>
          </div>

          <a 
            href="https://instagram.com/cega.2026" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              textDecoration: 'none',
              marginTop: '1rem',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '1rem', 
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
              padding: '1.25rem 2.5rem', 
              borderRadius: '100px', 
              color: 'white', 
              fontWeight: 600, 
              fontSize: '1.2rem',
              boxShadow: '0 10px 25px rgba(220, 39, 67, 0.4)'
            }}
          >
            <Camera size={24} />
            Contactanos por MD
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkWithUsSection;
