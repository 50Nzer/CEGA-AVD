import React, { useState } from 'react';
import { Calendar, FileText, Bell, MessageSquare, LogOut, ClipboardList, Users, Rocket, MessageCircle, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeSectionProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  navigateTo: (tab: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ isAuthenticated, setIsAuthenticated, navigateTo }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [curso, setCurso] = useState('1');
  const [division, setDivision] = useState('A');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && apellido) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsAuthenticated(true);
      }, 5000);
    }
  };

  const formInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left' as const,
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner-container-centered">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: 'spring' }} className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} className="liquid-glass hover-glass" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Identifícate</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ingresa tus datos para acceder a las funciones del CE.</p>
          
          <div style={{ textAlign: 'left' }}>
            <label style={labelStyle}>Nombre</label>
            <input required style={formInputStyle} placeholder="Ej. Juan" value={nombre} onChange={e => setNombre(e.target.value)} />
            
            <label style={labelStyle}>Apellido</label>
            <input required style={formInputStyle} placeholder="Ej. Pérez" value={apellido} onChange={e => setApellido(e.target.value)} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Curso</label>
                <select style={formInputStyle} value={curso} onChange={e => setCurso(e.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c} style={{color: 'black'}}>{c}°</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>División</label>
                <select style={formInputStyle} value={division} onChange={e => setDivision(e.target.value)}>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(d => <option key={d} value={d} style={{color: 'black'}}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="liquid-glass-strong" style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem' }}>
            Continuar
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="container animate-slide-up" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hola, <span style={{ color: '#60a5fa' }}>{nombre}</span> 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{curso}° {division} - Estas son las novedades del día.</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,0,0,0.3)', color: '#fca5a5' }}>
          <LogOut size={16} /> Salir
        </button>
      </div>

      <motion.div className="bento-grid" variants={containerVariants} initial="hidden" animate="show">
        
        {/* Anuncios */}
        <motion.div variants={itemVariants} className="liquid-glass hover-glass cursor-pointer" onClick={() => navigateTo('anuncios')} style={{ padding: '2rem', gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(252, 211, 77, 0.2)', padding: '1rem', borderRadius: '50%' }}>
              <Bell size={28} color="#fcd34d" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Anuncios</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Novedades e información oficial.</p>
            </div>
          </div>
        </motion.div>

        {/* Encuestas */}
        <motion.div variants={itemVariants} className="liquid-glass hover-glass cursor-pointer" onClick={() => navigateTo('encuestas')} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', gridColumn: 'span 4' }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <ClipboardList size={32} color="#34d399" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Encuestas</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vota proyectos.</p>
          </div>
        </motion.div>

        {/* Quienes Somos */}
        <motion.div variants={itemVariants} className="liquid-glass hover-glass cursor-pointer" onClick={() => navigateTo('quienes-somos')} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', gridColumn: 'span 4' }}>
          <div style={{ background: 'rgba(192, 132, 252, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Users size={32} color="#c084fc" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>¿Quiénes Somos?</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Conocé al equipo.</p>
          </div>
        </motion.div>

        {/* Trabaja con Nosotros */}
        <motion.div variants={itemVariants} className="liquid-glass hover-glass cursor-pointer" onClick={() => navigateTo('trabaja-con-nosotros')} style={{ padding: '2rem', gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)' }}>
              <Rocket size={28} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Trabaja con Nosotros</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Sumate a representar el colegio.</p>
            </div>
          </div>
        </motion.div>

        {/* Redes: WhatsApp */}
        <motion.a 
          href="https://whatsapp.com/channel/0029VbBd3742UPBBMqVMpz31" 
          target="_blank" rel="noopener noreferrer"
          variants={itemVariants} 
          className="liquid-glass hover-glass" 
          style={{ textDecoration: 'none', color: 'inherit', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', gridColumn: 'span 6' }}
        >
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <MessageCircle size={32} color="#22c55e" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Canal Oficial</h3>
        </motion.a>

        {/* Redes: Instagram */}
        <motion.a 
          href="https://instagram.com/cega.2026" 
          target="_blank" rel="noopener noreferrer"
          variants={itemVariants} 
          className="liquid-glass hover-glass" 
          style={{ textDecoration: 'none', color: 'inherit', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', gridColumn: 'span 6' }}
        >
          <div style={{ background: 'linear-gradient(45deg, rgba(240, 148, 51, 0.2) 0%, rgba(230, 104, 60, 0.2) 25%, rgba(220, 39, 67, 0.2) 50%, rgba(204, 35, 102, 0.2) 75%, rgba(188, 24, 136, 0.2) 100%)', padding: '1rem', borderRadius: '50%' }}>
            <Camera size={32} color="#fb7185" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>@cega.2026</h3>
        </motion.a>

      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '1rem' }}>
        <p className="typewriter-slogan" style={{ display: 'inline-block', margin: 0, fontSize: '2rem', fontStyle: 'italic', fontWeight: 600, color: 'var(--text-muted)' }}>
          "Tu voz, vale."
        </p>
      </motion.div>
      <style>{`
        @keyframes typing {
          0% { width: 0; opacity: 1; }
          40% { width: 100%; opacity: 1; }
          60% { width: 100%; opacity: 1; }
          90% { width: 0; opacity: 1; }
          100% { width: 0; opacity: 1; }
        }
        @keyframes blink-caret {
          from, to { border-right-color: transparent }
          50% { border-right-color: rgba(255,255,255,0.7); }
        }
        .typewriter-slogan {
          overflow: hidden;
          border-right: 3px solid rgba(255,255,255,0.7);
          white-space: nowrap;
          animation: 
            typing 6s steps(20, end) infinite,
            blink-caret .75s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeSection;
