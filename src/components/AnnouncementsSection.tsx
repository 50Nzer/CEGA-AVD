import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AnnouncementsProps {
  onBack: () => void;
}

interface Anuncio {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  tagPrecio?: string;
  tagHora?: string;
  tagLugar?: string;
  tagQuienes?: string;
  tagObligatorio?: boolean;
  createdAt?: any;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

const AnnouncementsSection: React.FC<AnnouncementsProps> = ({ onBack }) => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'anuncios'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAnuncios(snap.docs.map(d => ({ id: d.id, ...d.data() } as Anuncio)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', marginBottom: '2rem', cursor: 'pointer', fontSize: '0.95rem' }}
      >
        <ArrowLeft size={18} /> Volver al Inicio
      </motion.button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Anuncios Oficiales</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.75rem' }}>Todo lo que necesitás saber, en detalle.</p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Loader2 size={40} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : anuncios.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.75rem' }}>Sin anuncios por ahora</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.05rem' }}>El CE publicará novedades aquí cuando estén disponibles. ¡Volvé pronto!</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '820px', margin: '0 auto' }}
        >
          {anuncios.map((anuncio) => (
            <motion.div key={anuncio.id} variants={itemVariants} className="liquid-glass hover-glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '2.25rem 2.5rem' }}>
                <h2 style={{ fontSize: '1.9rem', margin: '0 0 0.4rem', lineHeight: 1.2 }}>{anuncio.title}</h2>
                {anuncio.subtitle && (
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1.25rem', color: '#60a5fa', fontWeight: 500 }}>{anuncio.subtitle}</h3>
                )}
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: '0 0 1.75rem' }}>{anuncio.details}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {anuncio.tagPrecio && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(52,211,153,0.12)', color: '#34d399', padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600 }}>
                      <DollarSign size={14} /> {anuncio.tagPrecio}
                    </span>
                  )}
                  {anuncio.tagHora && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(167,139,250,0.12)', color: '#c084fc', padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600 }}>
                      <Clock size={14} /> {anuncio.tagHora}
                    </span>
                  )}
                  {anuncio.tagLugar && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600 }}>
                      <MapPin size={14} /> {anuncio.tagLugar}
                    </span>
                  )}
                  {anuncio.tagQuienes && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(96,165,250,0.12)', color: '#60a5fa', padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600 }}>
                      <Users size={14} /> {anuncio.tagQuienes}
                    </span>
                  )}
                  {anuncio.tagObligatorio && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239,68,68,0.12)', color: '#f87171', padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600 }}>
                      <AlertCircle size={14} /> Asistencia Obligatoria
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AnnouncementsSection;
