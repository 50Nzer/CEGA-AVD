import React from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockActas = [
  { id: 1, title: 'Acta de Asamblea Extraordinaria', date: '10 Abril 2026', status: 'Enviada' },
  { id: 2, title: 'Propuesta de Modificación CCEE', date: '02 Abril 2026', status: 'Aprobada' },
  { id: 3, title: 'Acta N°4 - Reunión de Delegados', date: '15 Marzo 2026', status: 'Enviada' },
  { id: 4, title: 'Solicitud de Presupuesto Evento Deportivo', date: '28 Febrero 2026', status: 'Revisión' },
  { id: 5, title: 'Acta Constitutiva Anual Centro', date: '15 Febrero 2026', status: 'Aprobada' },
];

const DocumentsSection = () => {
  return (
    <div className="container animate-slide-up" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem' }}>Documentos y Actas</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Un repositorio digital 100% transparente con todas las actas y resoluciones enviadas a la dirección del colegio.
        </p>
      </div>

      <motion.div 
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}
        initial="hidden" animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {mockActas.map((acta, idx) => (
          <motion.div 
            key={acta.id} 
            className="liquid-glass hover-glass" 
            variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { type: 'spring' } } }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderRadius: '24px' }}
          >
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', fontWeight: 500 }}>{acta.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>{acta.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: acta.status === 'Aprobada' ? '#34d399' : acta.status === 'Enviada' ? '#60a5fa' : '#fbbf24' }}>
                    <CheckCircle2 size={14} /> {acta.status}
                  </span>
                </div>
              </div>
            </div>

            <button className="liquid-glass-strong hover-glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Download size={18} /> Descargar PDF
            </button>
            
          </motion.div>
        ))}
      </motion.div>
      
      <style>{`
        @media (max-width: 600px) {
          .hover-glass { flex-direction: column; gap: 1rem; align-items: flex-start !important; }
          .hover-glass button { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default DocumentsSection;
