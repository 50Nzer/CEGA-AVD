import React, { useState } from 'react';
import { ShieldAlert, MessageSquarePlus, ArrowLeft, Send, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CurrentUser } from '../App';

interface ContactSectionProps {
  currentUser: CurrentUser | null;
}

const ContactSection: React.FC<ContactSectionProps> = ({ currentUser }) => {
  const [activeForm, setActiveForm] = useState<'none' | 'delicada' | 'sugerencia'>('none');
  const [tema, setTema] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Optional identity override if user is NOT logged in
  const [remNombre, setRemNombre] = useState('');
  const [remApellido, setRemApellido] = useState('');
  const [remCurso, setRemCurso] = useState('1');
  const [remDivision, setRemDivision] = useState('A');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    const remitente = currentUser
      ? { nombre: currentUser.nombre, apellido: currentUser.apellido, curso: currentUser.curso, division: currentUser.division }
      : remNombre
        ? { nombre: remNombre, apellido: remApellido, curso: remCurso, division: remDivision }
        : null;

    try {
      await addDoc(collection(db, 'contactos'), {
        tipo: activeForm,
        tema,
        descripcion,
        remitente,
        anonimo: remitente === null,
        enviadoEn: serverTimestamp(),
        leido: false,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setActiveForm('none');
        setTema('');
        setDescripcion('');
        setRemNombre('');
        setRemApellido('');
      }, 3500);
    } catch (err) {
      console.error(err);
      setError('Error al enviar. Intentá de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1.25rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'left',
    marginBottom: '0.4rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
  };

  if (activeForm !== 'none') {
    const isDelicate = activeForm === 'delicada';
    const accentColor = isDelicate ? '#f87171' : '#60a5fa';
    const accentBg = isDelicate ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)';

    return (
      <div className="container" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: '620px', marginBottom: '1.5rem' }}>
          <button onClick={() => setActiveForm('none')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem' }}>
            <ArrowLeft size={18} /> Volver a Opciones
          </button>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          onSubmit={handleSubmit}
          className="liquid-glass"
          style={{ width: '100%', maxWidth: '620px', padding: '2.5rem', borderRadius: '24px' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: accentBg, padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
              {isDelicate ? <ShieldAlert size={28} color={accentColor} /> : <MessageSquarePlus size={28} color={accentColor} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.7rem', margin: 0 }}>
                {isDelicate ? 'Situación Delicada' : 'Sugerencia o Reclamo'}
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                {isDelicate ? 'Reporte 100% anónimo y confidencial.' : 'Ayudanos a mejorar el colegio y el centro.'}
              </p>
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(52,211,153,0.08)', borderRadius: '16px', border: '1px solid rgba(52,211,153,0.2)' }}>
              <Send size={44} color="#34d399" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>¡Enviado con éxito!</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Gracias por comunicarte. Volviendo...</p>
            </div>
          ) : (
            <div>
              {/* Sender identity block */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <User size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {currentUser ? 'ENVIADO COMO' : 'IDENTIFICACIÓN (OPCIONAL)'}
                  </span>
                </div>

                {currentUser ? (
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                    {currentUser.nombre} {currentUser.apellido} &mdash; {currentUser.curso}° {currentUser.division}
                  </p>
                ) : (
                  <div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      No estás logueado. Podés identificarte o dejar en blanco para ser anónimo.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Nombre</label>
                        <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Opcional" value={remNombre} onChange={e => setRemNombre(e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Apellido</label>
                        <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Opcional" value={remApellido} onChange={e => setRemApellido(e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Curso</label>
                        <select style={{ ...selectStyle, marginBottom: 0 }} value={remCurso} onChange={e => setRemCurso(e.target.value)}>
                          {[1,2,3,4,5,6].map(c => <option key={c} value={c} style={{ color: 'black' }}>{c}°</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>División</label>
                        <select style={{ ...selectStyle, marginBottom: 0 }} value={remDivision} onChange={e => setRemDivision(e.target.value)}>
                          {['A','B','C','D','E','F'].map(d => <option key={d} value={d} style={{ color: 'black' }}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message fields */}
              <label style={labelStyle}>Tema</label>
              <input
                required
                style={inputStyle}
                placeholder={isDelicate ? 'Ej. Bullying, Problema con profesor...' : 'Ej. Nuevo microondas, Baños...'}
                value={tema}
                onChange={e => setTema(e.target.value)}
              />

              <label style={labelStyle}>Descripción</label>
              <textarea
                required
                style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
                placeholder="Contanos qué pasó o qué proponés con la mayor cantidad de detalles posible..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />

              {error && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="liquid-glass-strong hover-glass"
                style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}
              >
                <Send size={18} /> {sending ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>
          )}
        </motion.form>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 0.75rem' }}>Contacto</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
          El Centro de Estudiantes está para escucharte. Elegí el canal que mejor se adapte a tu situación.
        </p>
      </motion.div>

      <motion.div
        className="bento-grid"
        style={{ maxWidth: '860px', margin: '0 auto' }}
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
      >
        <motion.button
          variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } } }}
          className="liquid-glass hover-glass"
          onClick={() => setActiveForm('delicada')}
          style={{ padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', gridColumn: 'span 6', cursor: 'pointer', border: 'none', color: 'white', width: '100%' }}
        >
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1.5rem', borderRadius: '50%', boxShadow: 'inset 0 0 20px rgba(239,68,68,0.2)' }}>
            <ShieldAlert size={48} color="#f87171" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.7rem', margin: '0 0 0.5rem', color: '#f87171' }}>Situación Delicada</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
              Reportá casos de bullying, acoso o problemas graves. <strong style={{ color: 'white' }}>100% Anónimo</strong>. Nadie sabrá tu identidad.
            </p>
          </div>
        </motion.button>

        <motion.button
          variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } } }}
          className="liquid-glass hover-glass"
          onClick={() => setActiveForm('sugerencia')}
          style={{ padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', gridColumn: 'span 6', cursor: 'pointer', border: 'none', color: 'white', width: '100%' }}
        >
          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1.5rem', borderRadius: '50%', boxShadow: 'inset 0 0 20px rgba(59,130,246,0.2)' }}>
            <MessageSquarePlus size={48} color="#60a5fa" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.7rem', margin: '0 0 0.5rem', color: '#60a5fa' }}>Sugerencia o Reclamo</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
              Proponé ideas, torneos, mejoras edilicias o presentá quejas sobre el funcionamiento general.
            </p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ContactSection;
