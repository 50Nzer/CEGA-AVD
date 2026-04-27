import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Inbox, History, Loader2, CheckCircle2, X } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SurveysSectionProps {
  onBack: () => void;
}

const VOTED_KEY = 'cega_voted_encuestas';

const getVoted = (): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(VOTED_KEY) ?? '{}'); }
  catch { return {}; }
};

const saveVoted = (v: Record<string, string>) =>
  localStorage.setItem(VOTED_KEY, JSON.stringify(v));

const SurveysSection: React.FC<SurveysSectionProps> = ({ onBack }) => {
  const [viewHistory, setViewHistory] = useState(false);
  const [activas, setActivas]   = useState<any[]>([]);
  const [cerradas, setCerradas] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [voted, setVoted]       = useState<Record<string, string>>(getVoted);
  const [busy, setBusy]         = useState<string | null>(null); // encuesta id being updated

  useEffect(() => {
    const qA = query(collection(db, 'encuestas'), where('activa', '==', true),  orderBy('createdAt', 'desc'));
    const qC = query(collection(db, 'encuestas'), where('activa', '==', false), orderBy('createdAt', 'desc'));
    let n = 0;
    const done = () => { n++; if (n === 2) setLoading(false); };
    const u1 = onSnapshot(qA, s => { setActivas(s.docs.map(d => ({ id: d.id, ...d.data() }))); done(); }, done);
    const u2 = onSnapshot(qC, s => { setCerradas(s.docs.map(d => ({ id: d.id, ...d.data() }))); done(); }, done);
    return () => { u1(); u2(); };
  }, []);

  /** Vote, change vote, or remove vote */
  const handleVote = async (encId: string, optKey: string) => {
    if (busy) return;
    setBusy(encId);
    const prev = voted[encId];
    try {
      if (!prev) {
        // New vote
        await updateDoc(doc(db, 'encuestas', encId), {
          [`opciones.${optKey}.votos`]: increment(1),
        });
        const next = { ...voted, [encId]: optKey };
        setVoted(next); saveVoted(next);
      } else if (prev === optKey) {
        // Remove vote
        await updateDoc(doc(db, 'encuestas', encId), {
          [`opciones.${optKey}.votos`]: increment(-1),
        });
        const next = { ...voted };
        delete next[encId];
        setVoted(next); saveVoted(next);
      } else {
        // Change vote: decrement old, increment new
        await updateDoc(doc(db, 'encuestas', encId), {
          [`opciones.${prev}.votos`]: increment(-1),
          [`opciones.${optKey}.votos`]: increment(1),
        });
        const next = { ...voted, [encId]: optKey };
        setVoted(next); saveVoted(next);
      }
    } catch (e) {
      console.error('Error al votar:', e);
    } finally {
      setBusy(null);
    }
  };

  const renderEncuesta = (enc: any, readonly: boolean) => {
    const opts        = enc.opciones ? (Object.entries(enc.opciones) as [string, any][]) : [];
    const totalVotos  = opts.reduce((s, [, v]) => s + (v.votos ?? 0), 0);
    const myVote      = voted[enc.id];
    const isBusy      = busy === enc.id;

    // Sort by votes descending for history view
    const sortedOpts = readonly ? [...opts].sort((a, b) => (b[1].votos ?? 0) - (a[1].votos ?? 0)) : opts;

    return (
      <motion.div
        key={enc.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="liquid-glass"
        style={{ borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', lineHeight: 1.3 }}>{enc.titulo}</h2>
            {!readonly && myVote && (
              <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8', padding: '0.2rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                ✓ Votaste
              </span>
            )}
          </div>
          {enc.descripcion && (
            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{enc.descripcion}</p>
          )}
          {enc.fechaCierre && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              📅 {readonly ? 'Cerrada el' : 'Cierra el'}: {enc.fechaCierre}
            </p>
          )}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedOpts.map(([key, val]) => {
            const pct       = totalVotos > 0 ? Math.round((val.votos / totalVotos) * 100) : 0;
            const isMyVote  = myVote === key;
            const isWinner  = readonly && val.votos === Math.max(...opts.map(([, v]) => v.votos ?? 0)) && totalVotos > 0;

            return (
              <div key={key}>
                <motion.button
                  whileHover={readonly ? {} : { scale: 1.01 }}
                  whileTap={readonly ? {} : { scale: 0.99 }}
                  onClick={() => !readonly && handleVote(enc.id, key)}
                  disabled={readonly || isBusy}
                  style={{
                    width: '100%',
                    background: isMyVote
                      ? 'rgba(79,70,229,0.15)'
                      : isWinner
                      ? 'rgba(52,211,153,0.08)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isMyVote ? 'rgba(79,70,229,0.5)' : isWinner ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '14px',
                    padding: '0.875rem 1rem',
                    cursor: readonly ? 'default' : isBusy ? 'wait' : 'pointer',
                    transition: 'all 0.25s',
                    textAlign: 'left',
                    display: 'block',
                  }}
                >
                  {/* Option label row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: isMyVote || isWinner ? 700 : 400, color: isMyVote ? '#818cf8' : isWinner ? '#34d399' : 'white', fontSize: '0.95rem' }}>
                      {isMyVote && <CheckCircle2 size={15} color="#818cf8" />}
                      {isWinner && !isMyVote && <span style={{ fontSize: '0.85rem' }}>🏆</span>}
                      {val.texto}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isMyVote ? '#818cf8' : isWinner ? '#34d399' : 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                      {pct}% · {val.votos} voto{val.votos !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                      style={{
                        height: '100%',
                        borderRadius: '100px',
                        background: isMyVote
                          ? 'linear-gradient(90deg, #4f46e5, #818cf8)'
                          : isWinner
                          ? 'linear-gradient(90deg, #059669, #34d399)'
                          : 'rgba(255,255,255,0.18)',
                      }}
                    />
                  </div>
                </motion.button>

                {/* Change / remove hint */}
                {!readonly && isMyVote && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ margin: '0.3rem 0 0 0.5rem', fontSize: '0.75rem', color: 'rgba(129,140,248,0.6)' }}
                  >
                    Tocá de nuevo para quitar tu voto · Tocá otra opción para cambiarlo
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {totalVotos} voto{totalVotos !== 1 ? 's' : ''} totales
          </span>
          {!readonly && myVote && (
            <button
              onClick={() => handleVote(enc.id, myVote)}
              disabled={isBusy}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
            >
              <X size={12} /> Eliminar voto
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const lista = viewHistory ? cerradas : activas;

  return (
    <div className="container" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: '720px', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}>
          <ArrowLeft size={18} /> Volver al Inicio
        </button>
      </motion.div>

      <div style={{ width: '100%', maxWidth: '720px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>Encuestas</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
            Podés votar, cambiar tu voto o eliminarlo cuando quieras.
          </p>
          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', padding: '0.3rem' }}>
            {[
              { label: 'Activas', icon: <Inbox size={14} />, key: false, count: activas.length },
              { label: 'Historial', icon: <History size={14} />, key: true, count: cerradas.length },
            ].map(tab => (
              <button
                key={String(tab.key)}
                onClick={() => setViewHistory(tab.key)}
                style={{
                  padding: '0.45rem 1.25rem',
                  borderRadius: '100px',
                  border: 'none',
                  background: viewHistory === tab.key ? 'rgba(79,70,229,0.35)' : 'transparent',
                  color: viewHistory === tab.key ? '#818cf8' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: viewHistory === tab.key ? 700 : 400,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {tab.icon} {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 size={36} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={viewHistory ? 'h' : 'a'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {lista.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass" style={{ padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{viewHistory ? '📜' : '📋'}</div>
                  <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.75rem' }}>
                    {viewHistory ? 'Sin encuestas cerradas' : 'No hay encuestas activas'}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                    {viewHistory ? 'El historial aparecerá aquí cuando se cierren encuestas.' : '¡Volvé pronto! El CE publicará encuestas cuando las necesite.'}
                  </p>
                </motion.div>
              ) : (
                lista.map(enc => renderEncuesta(enc, viewHistory))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SurveysSection;
