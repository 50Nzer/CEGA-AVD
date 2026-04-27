import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

type Nivel = 'MESA' | 'SEC' | 'SUB' | 'COM';

interface Miembro {
  nombre: string;
  nivel: Nivel;
  area: string;
}

const miembros: Miembro[] = [
  // MESA
  { nombre: 'Morena Kopecky',       nivel: 'MESA', area: 'Presidente' },
  { nombre: 'Luciano Olcina',       nivel: 'MESA', area: 'Vicepresidente' },
  { nombre: 'Luna Aguilera',        nivel: 'MESA', area: 'Secretario General' },
  { nombre: 'Joaquin Valfré',       nivel: 'MESA', area: 'Secretario Parlamentario' },
  // SEC
  { nombre: 'Cecilia Wagner',       nivel: 'SEC',  area: 'Asuntos Sociales' },
  { nombre: 'Carolina Villarreal',  nivel: 'SEC',  area: 'Problemáticas Edilicias y de Infraestructura' },
  { nombre: 'Facundo Aguero',       nivel: 'SEC',  area: 'Actas y Archivo' },
  { nombre: 'Alma Jimenez',         nivel: 'SEC',  area: 'Salud y Ambiente' },
  { nombre: 'Agustin Vega',         nivel: 'SEC',  area: 'Comunicación y Prensa' },
  { nombre: 'Antonella Espindola',  nivel: 'SEC',  area: 'Relaciones Exteriores' },
  { nombre: 'Rocio Albornoz',       nivel: 'SEC',  area: 'Finanzas y Hacienda' },
  { nombre: 'Victoria Bariles',     nivel: 'SEC',  area: 'Deportes y Recreación' },
  { nombre: 'Bárbara Zambrano',     nivel: 'SEC',  area: 'Arte y Cultura' },
  // SUB
  { nombre: 'Ariana Kopecky',       nivel: 'SUB',  area: 'Derechos Humanos' },
  { nombre: 'Ivan Suarez',          nivel: 'SUB',  area: 'Género y Diversidad' },
  { nombre: 'Ariadna Cuello',       nivel: 'SUB',  area: 'Problemáticas Edilicias y de Infraestructura' },
  { nombre: 'Catalina Cuello',      nivel: 'SUB',  area: 'Salud y Ambiente' },
  { nombre: 'Violeta Carraro',      nivel: 'SUB',  area: 'Comunicación y Prensa' },
  { nombre: 'Celeste Nievas',       nivel: 'SUB',  area: 'Relaciones Exteriores' },
  { nombre: 'Melina Flores',        nivel: 'SUB',  area: 'Finanzas y Hacienda' },
  { nombre: 'Thiago Maujo',         nivel: 'SUB',  area: 'Deportes y Recreación' },
  { nombre: 'Valentín Cordero',     nivel: 'SUB',  area: 'Arte y Cultura' },
  // COM
  { nombre: 'Luca Zuñiga',          nivel: 'COM',  area: 'Derechos Humanos' },
  { nombre: 'Tomi Alzuarena',       nivel: 'COM',  area: 'Derechos Humanos' },
  { nombre: 'Guille Wagner',        nivel: 'COM',  area: 'Género y Diversidad' },
  { nombre: 'Jazmin Bazan',         nivel: 'COM',  area: 'Salud y Ambiente' },
  { nombre: 'Zoe Ganmaroto',        nivel: 'COM',  area: 'Salud y Ambiente' },
  { nombre: 'Magali Ferreyra',      nivel: 'COM',  area: 'Comunicación y Prensa' },
  { nombre: 'Ludmila Duarte',       nivel: 'COM',  area: 'Comunicación y Prensa' },
  { nombre: 'Antonella Brunetto',   nivel: 'COM',  area: 'Relaciones Exteriores' },
  { nombre: 'Santino Bertoli',      nivel: 'COM',  area: 'Deportes y Recreación' },
  { nombre: 'Eduardo Rodriguez',    nivel: 'COM',  area: 'Deportes y Recreación' },
  { nombre: 'Sofía Arroyo',         nivel: 'COM',  area: 'Deportes y Recreación' },
  { nombre: 'Julieta Buffa',        nivel: 'COM',  area: 'Arte y Cultura' },
  { nombre: 'Zaira Russo',          nivel: 'COM',  area: 'Arte y Cultura' },
  { nombre: 'Alejandro Ibarra',     nivel: 'COM',  area: 'Arte y Cultura' },
  { nombre: 'Umma Luere',           nivel: 'COM',  area: 'Arte y Cultura' },
];

const nivelConfig: Record<Nivel, { label: string; color: string; bg: string; order: number }> = {
  MESA: { label: 'Mesa Directiva', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  order: 1 },
  SEC:  { label: 'Secretaría',     color: '#f87171', bg: 'rgba(248,113,113,0.12)', order: 2 },
  SUB:  { label: 'Subsecretaría',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  order: 3 },
  COM:  { label: 'Comisión',       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', order: 4 },
};

const niveles: Nivel[] = ['MESA', 'SEC', 'SUB', 'COM'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 22 } },
};

const AboutUsSection: React.FC<AboutUsProps> = ({ onBack }) => {
  const [filtro, setFiltro] = useState<Nivel | 'TODOS'>('TODOS');

  const filtrados = filtro === 'TODOS'
    ? miembros
    : miembros.filter(m => m.nivel === filtro);

  const iniciales = (nombre: string) =>
    nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', marginBottom: '2rem', cursor: 'pointer', fontSize: '0.95rem' }}
      >
        <ArrowLeft size={18} /> Volver al Inicio
      </motion.button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>¿Quiénes Somos?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
          Los <strong style={{ color: 'white' }}>{miembros.length} integrantes</strong> del Centro de Estudiantes CEGA 2026.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
      >
        {(['TODOS', ...niveles] as (Nivel | 'TODOS')[]).map(n => {
          const active = filtro === n;
          const cfg = n === 'TODOS' ? null : nivelConfig[n as Nivel];
          return (
            <button
              key={n}
              onClick={() => setFiltro(n)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                border: `1px solid ${active ? (cfg?.color ?? 'white') : 'rgba(255,255,255,0.1)'}`,
                background: active ? (cfg?.bg ?? 'rgba(255,255,255,0.1)') : 'transparent',
                color: active ? (cfg?.color ?? 'white') : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: active ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              {n === 'TODOS' ? 'Todos' : cfg!.label}
              <span style={{ marginLeft: '0.4rem', opacity: 0.7, fontSize: '0.78rem' }}>
                ({n === 'TODOS' ? miembros.length : miembros.filter(m => m.nivel === n).length})
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filtro}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem', maxWidth: '1100px', margin: '0 auto' }}
        >
          {filtrados.map((m, i) => {
            const cfg = nivelConfig[m.nivel];
            return (
              <motion.div
                key={`${m.nombre}-${i}`}
                variants={itemVariants}
                className="liquid-glass hover-glass"
                style={{ padding: '1.25rem 1.5rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `3px solid ${cfg.color}` }}
              >
                {/* Avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: cfg.bg, border: `1px solid ${cfg.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: cfg.color,
                }}>
                  {iniciales(m.nombre)}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.nombre}
                  </h3>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.area}
                  </p>
                  <span style={{
                    display: 'inline-block', marginTop: '0.3rem',
                    background: cfg.bg, color: cfg.color,
                    padding: '0.1rem 0.5rem', borderRadius: '100px',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
                  }}>
                    {m.nivel === 'MESA' ? 'Mesa Directiva' : m.nivel === 'SEC' ? 'Secretaría' : m.nivel === 'SUB' ? 'Subsecretaría' : 'Comisión'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '3rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {niveles.map(n => (
          <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: nivelConfig[n].color, display: 'inline-block' }} />
            <strong style={{ color: nivelConfig[n].color }}>{n}</strong> — {nivelConfig[n].label}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AboutUsSection;
