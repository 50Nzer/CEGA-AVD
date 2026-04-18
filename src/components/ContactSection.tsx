import React, { useState } from 'react';
import { ShieldAlert, MessageSquarePlus, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [activeForm, setActiveForm] = useState<'none' | 'delicada' | 'sugerencia'>('none');
  const [tema, setTema] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveForm('none');
      setTema('');
      setDescripcion('');
    }, 3000);
  };

  const formInputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left' as const,
    marginBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--text)'
  };

  if (activeForm !== 'none') {
    const isDelicate = activeForm === 'delicada';
    return (
      <div className="container" style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
          <button onClick={() => setActiveForm('none')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} /> Volver a Opciones
          </button>
        </motion.div>

        <motion.form initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring' }} onSubmit={handleSubmit} className="liquid-glass hover-glass" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: isDelicate ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
              {isDelicate ? <ShieldAlert size={32} color="#fca5a5" /> : <MessageSquarePlus size={32} color="#93c5fd" />}
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>
                {isDelicate ? 'Situación Delicada' : 'Sugerencia o Reclamo'}
              </h2>
              <p style={{ color: isDelicate ? '#fca5a5' : 'var(--text-muted)', margin: 0, marginTop: '0.25rem' }}>
                {isDelicate ? 'Reporte 100% Anónimo y Confidencial.' : 'Ayudanos a mejorar el colegio y el centro.'}
              </p>
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '16px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <Send size={48} color="#34d399" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>¡Enviado con éxito!</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Gracias por comunicarte. Regresando...</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              <label style={labelStyle}>Tema</label>
              <input required style={formInputStyle} placeholder={isDelicate ? "Ej. Bullying, Problema con profesor..." : "Ej. Nuevo microondas, Baños..."} value={tema} onChange={e => setTema(e.target.value)} />
              
              <label style={labelStyle}>Descripción</label>
              <textarea required style={{ ...formInputStyle, minHeight: '150px', resize: 'vertical' }} placeholder="Contanos qué pasó o qué proponés con la mayor cantidad de detalles posible..." value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              
              <button type="submit" className="liquid-glass-strong hover-glass" style={{ width: '100%', padding: '1.25rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={20} /> Enviar Mensaje
              </button>
            </div>
          )}
        </motion.form>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem' }}>Contacto</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          El Centro de Estudiantes está para escucharte. Elegí el canal de comunicación que mejor se adapte a tu situación.
        </p>
      </motion.div>

      <motion.div 
        className="bento-grid" 
        style={{ maxWidth: '900px', margin: '0 auto' }}
        initial="hidden" animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
      >
        
        <motion.button 
          variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } } }}
          className="liquid-glass hover-glass" onClick={() => setActiveForm('delicada')} style={{ padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', gridColumn: 'span 6', cursor: 'pointer', border: 'none', color: 'white' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={48} color="#f87171" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem', color: '#f87171' }}>Situación Delicada</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
              Reportá casos de bullying, acoso, o problemas graves. <strong style={{ color: 'white' }}>100% Anónimo</strong>. Nadie sabrá tu identidad.
            </p>
          </div>
        </motion.button>

        <motion.button 
          variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } } }}
          className="liquid-glass hover-glass" onClick={() => setActiveForm('sugerencia')} style={{ padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', gridColumn: 'span 6', cursor: 'pointer', border: 'none', color: 'white' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '50%', boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.2)' }}>
            <MessageSquarePlus size={48} color="#60a5fa" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem', color: '#60a5fa' }}>Sugerencia o Reclamo</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
              Proponé ideas, torneos, mejoras edilicias o presentá quejas sobre el funcionamiento general.
            </p>
          </div>
        </motion.button>

      </motion.div>
    </div>
  );
};

export default ContactSection;
