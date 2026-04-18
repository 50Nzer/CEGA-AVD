import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface HeroSectionProps {
  onEnter: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onEnter }) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <motion.h1 variants={item} style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Tu Centro de Estudiantes.<br/>
        <span style={{ background: 'linear-gradient(to right, #ff4e50, #f9d423)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tu Espacio.</span>
      </motion.h1>
      
      <motion.p variants={item} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
        La plataforma digital definitiva para mantenerte informado, participar y hacer que tu voz se escuche en el colegio.
      </motion.p>

      <motion.div variants={item} className="hero-glow-container">
        <div className="hero-glow-blur hero-glow-blur-large">
          <div className="hero-glow-ring"></div>
        </div>
        <div className="hero-glow-blur hero-glow-blur-medium">
          <div className="hero-glow-ring"></div>
        </div>
        <div className="hero-glow-blur hero-glow-blur-sharp">
          <div className="hero-glow-ring"></div>
        </div>
        
        <button 
          className="liquid-glass-strong hover-glass"
          onClick={onEnter}
          style={{
            position: 'relative',
            zIndex: 3,
            padding: '0.8rem 2.5rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            border: 'none',
            color: 'var(--text)'
          }}
        >
          Ingresar a la App
          <span style={{ fontSize: '1.5rem' }}>&rarr;</span>
        </button>
      </motion.div>
      
      <style>{`
        @media (max-width: 768px) {
          h1 { font-size: 3rem !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default HeroSection;
