import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Users, DollarSign, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface AnnouncementsProps {
  onBack: () => void;
}

const mockAnnouncements = [
  {
    id: 1,
    title: 'Gran Fiesta de Bienvenida',
    subtitle: 'Cerramos el primer trimestre con todo',
    details: 'Invitamos a todos los cursos a participar de la fiesta de bienvenida. Habrá buffet, DJ en vivo, sorteos y torneo de truco.',
    image: null,
    tags: {
      precio: '$2000 (Anticipada)',
      hora: 'Viernes 20:00hs',
      lugar: 'SUM del Colegio',
      quienes: 'De 1° a 6° Año',
      obligatorio: false
    }
  },
  {
    id: 2,
    title: 'Asamblea General Anual',
    subtitle: 'Presentación de estatuto y balance',
    details: 'Reunión vital para todos los delegados y subdelegados. Estaremos definiendo los ejes principales de acción para este año lectivo.',
    image: null,
    tags: {
      hora: 'Lunes 14:00hs',
      lugar: 'Aula Magna',
      quienes: 'Delegados',
      obligatorio: true
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
};

const AnnouncementsSection: React.FC<AnnouncementsProps> = ({ onBack }) => {
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
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Anuncios Oficiales</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Todo lo que necesitas saber, en detalle.</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {mockAnnouncements.map((anuncio) => (
          <motion.div key={anuncio.id} variants={itemVariants} className="liquid-glass hover-glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            {anuncio.image ? (
              <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={48} color="var(--text-muted)" />
              </div>
            ) : null}
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem', lineHeight: 1.2 }}>{anuncio.title}</h2>
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 1.5rem', color: '#60a5fa', fontWeight: 500 }}>{anuncio.subtitle}</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '2rem' }}>{anuncio.details}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {anuncio.tags.precio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}><DollarSign size={16} /> {anuncio.tags.precio}</div>
                )}
                {anuncio.tags.hora && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(167, 139, 250, 0.15)', color: '#c084fc', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}><Clock size={16} /> {anuncio.tags.hora}</div>
                )}
                {anuncio.tags.lugar && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}><MapPin size={16} /> {anuncio.tags.lugar}</div>
                )}
                {anuncio.tags.quienes && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}><Users size={16} /> {anuncio.tags.quienes}</div>
                )}
                {anuncio.tags.obligatorio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}><AlertCircle size={16} /> Asistencia Obligatoria</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementsSection;
