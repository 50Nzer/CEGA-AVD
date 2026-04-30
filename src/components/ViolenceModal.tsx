import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ViolenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TypewriterText = React.memo(() => {
  const [text, setText] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    
    const runSequence = async () => {
      while (!isCancelled) {
        // type "Es anonimo"
        const phrase1 = "Es anonimo";
        for (let i = 1; i <= phrase1.length; i++) {
          if (isCancelled) return;
          setText(phrase1.slice(0, i));
          await delay(100);
        }
        await delay(1500);
        
        // delete "anonimo" -> keep "Es "
        for (let i = phrase1.length; i >= 3; i--) {
          if (isCancelled) return;
          setText(phrase1.slice(0, i));
          await delay(50);
        }
        
        // type "Seguro"
        const word2 = "Seguro";
        for (let i = 1; i <= word2.length; i++) {
          if (isCancelled) return;
          setText("Es " + word2.slice(0, i));
          await delay(100);
        }
        await delay(1500);
        
        // delete "Seguro" -> keep "Es "
        for (let i = word2.length; i >= 0; i--) {
          if (isCancelled) return;
          setText("Es " + word2.slice(0, i));
          await delay(50);
        }
        
        // type "ayudar"
        const word3 = "ayudar";
        for (let i = 1; i <= word3.length; i++) {
          if (isCancelled) return;
          setText("Es " + word3.slice(0, i));
          await delay(100);
        }
        await delay(2000);
        
        // delete "Es ayudar" to start over
        const phrase3 = "Es ayudar";
        for (let i = phrase3.length; i >= 0; i--) {
          if (isCancelled) return;
          setText(phrase3.slice(0, i));
          await delay(50);
        }
        await delay(500);
      }
    };
    
    runSequence();
    return () => { isCancelled = true; };
  }, []);

  return (
    <span style={{ 
      borderRight: '2px solid rgba(255,255,255,0.7)', 
      paddingRight: '2px', 
      animation: 'blink-caret 0.75s step-end infinite' 
    }}>
      {text}
    </span>
  );
});

const ViolenceModal: React.FC<ViolenceModalProps> = React.memo(({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15);
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          document.body.style.overflow = '';
          window.open('https://docs.google.com/forms/d/1gjkQttFdWdm66cTtdAWsGuOZ_9ACf95eNToL--TXTP4/viewform', '_blank');
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 15) * circumference;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="liquid-glass"
            style={{
              maxWidth: '400px',
              width: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              position: 'relative',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)',
              background: 'rgba(20, 0, 0, 0.6)'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                padding: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={20} />
            </button>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
            </motion.div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fca5a5' }}>
              Redirigiendo al Formulario
            </h2>
            
            <div style={{ height: '2rem', marginBottom: '2rem' }}>
              <TypewriterText />
            </div>

            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="rgba(239, 68, 68, 0.2)"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                {timeLeft}
              </div>
            </div>

            <button
              onClick={onClose}
              className="liquid-glass-strong hover-glass"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

export default ViolenceModal;
