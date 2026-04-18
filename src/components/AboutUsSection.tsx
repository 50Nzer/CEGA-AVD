import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowLeft, UserCircle } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

const mockRoles = [
  { id: 1, role: 'Presidente', name: 'Juan Ignacio Pérez' },
  { id: 2, role: 'Vicepresidente', name: 'María C. Gómez' },
  { id: 3, role: 'Secretaria General', name: 'Lucía Fernández' },
  { id: 4, role: 'Tesorero', name: 'Martín Rodríguez' },
  { id: 5, role: 'Vocal Titular 1', name: 'Sofía Álvarez' },
  { id: 6, role: 'Vocal Titular 2', name: 'Tomás Romero' },
  { id: 7, role: 'Delegado de Deportes', name: 'Facundo Ledesma' },
  { id: 8, role: 'Delegada de Cultura', name: 'Valentina Silva' }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } }
};

const AboutUsSection: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <motion.button 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
        onClick={onBack} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', marginBottom: '2rem', cursor: 'pointer' }}
      >
        <ArrowLeft size={20} /> Volver al Inicio
      </motion.button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>¿Quiénes Somos?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Conocé a los representantes de tu Centro de Estudiantes.</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        {mockRoles.map((person) => (
          <motion.div key={person.id} variants={itemVariants} className="liquid-glass hover-glass" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%' }}>
              <UserCircle size={40} color="#a78bfa" />
            </div>
            <div>
              <p style={{ color: '#c084fc', margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{person.role}</p>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{person.name}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AboutUsSection;
