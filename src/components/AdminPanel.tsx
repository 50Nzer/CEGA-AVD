import React, { useState, useEffect } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AUTHORIZED_EMAIL = 'agustinvegabrunetto7@gmail.com';

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Docs State
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [docModel, setDocModel] = useState({ title: '', status: 'Aprobada', type: 'PDF', url: '' });

  // Events State
  const [eventos, setEventos] = useState<any[]>([]);
  const [eventoModel, setEventoModel] = useState({ title: '', dateStr: '', color: '#ef4444', isHoliday: true });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.email === AUTHORIZED_EMAIL) {
          setUser(u);
          setError('');
        } else {
          signOut(auth);
          setError('Acceso denegado: Email no autorizado.');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubDocs = onSnapshot(collection(db, 'documentos'), (snap) => {
      setDocumentos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubEventos = onSnapshot(collection(db, 'eventos'), (snap) => {
      setEventos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubDocs(); unsubEventos(); };
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user.email !== AUTHORIZED_EMAIL) {
        await signOut(auth);
        setError('Acceso denegado: Email no autorizado.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== AUTHORIZED_EMAIL) {
      setError('Acceso denegado: Email no autorizado.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Credenciales inválidas.');
    }
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'documentos'), {
        ...docModel,
        date: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
      });
      setDocModel({ title: '', status: 'Aprobada', type: 'PDF', url: '' });
    } catch (err) { }
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm("¿Borrar documento?")) await deleteDoc(doc(db, 'documentos', id));
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'eventos'), eventoModel);
      setEventoModel({ title: '', dateStr: '', color: '#ef4444', isHoliday: true });
    } catch (err) { }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("¿Borrar evento?")) await deleteDoc(doc(db, 'eventos', id));
  };

  if (loading) return <div style={{ background: '#111', color: '#fff', minHeight: '100vh', padding: '2rem' }}>Cargando...</div>;

  if (!user) {
    return (
      <div style={{ padding: '2rem', background: '#111', minHeight: '100vh', fontFamily: 'monospace', color: '#fff' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Volver
        </button>
        <div style={{ maxWidth: '400px', margin: '0 auto', border: '1px solid #333', padding: '2rem', background: '#000' }}>
          <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Admin Login</h2>
          {error && <div style={{ background: '#400', padding: '0.5rem', marginBottom: '1rem', border: '1px solid red' }}>{error}</div>}
          
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ padding: '0.5rem', background: '#333', border: '1px solid #555', color: '#fff', cursor: 'pointer' }}>Login Manual</button>
          </form>

          <div style={{ textAlign: 'center', margin: '1rem 0' }}>O</div>
          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '0.5rem', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Login con Google</button>
        </div>
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: '#fff', boxSizing: 'border-box' as const, marginBottom: '1rem' };

  return (
    <div style={{ padding: '2rem', background: '#111', minHeight: '100vh', fontFamily: 'monospace', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Panel de Administración - CEGA</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{user.email}</span>
          <button onClick={() => signOut(auth)} style={{ padding: '0.25rem 0.5rem', background: '#c00', color: '#fff', border: 'none', cursor: 'pointer' }}>Cerrar</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Documentos */}
        <div style={{ border: '1px solid #333', padding: '1rem', background: '#000' }}>
          <h2>Gestor de Actas</h2>
          <hr style={{ borderColor: '#333', marginBottom: '1rem' }} />
          
          <form onSubmit={handleAddDoc} style={{ marginBottom: '2rem', border: '1px dashed #333', padding: '1rem' }}>
            <label>Título / Nombre</label>
            <input required style={inputStyle} value={docModel.title} onChange={e => setDocModel({...docModel, title: e.target.value})} />
            
            <label>Estado</label>
            <select style={inputStyle} value={docModel.status} onChange={e => setDocModel({...docModel, status: e.target.value})}>
              <option value="Aprobada">Aprobada</option>
              <option value="Revisión">Revisión</option>
              <option value="Enviada">Enviada</option>
            </select>

            <label>Enlace de Google Drive</label>
            <input required type="url" style={inputStyle} value={docModel.url} onChange={e => setDocModel({...docModel, url: e.target.value})} />

            <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Agregar Acta</button>
          </form>

          <div>
            <h3>Archivos Subidos ({documentos.length})</h3>
            {documentos.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #333' }}>
                <div style={{ overflow: 'hidden' }}>
                  <strong>{d.title}</strong><br/>
                  <small style={{ color: '#888' }}>{d.date} - {d.status}</small>
                </div>
                <button onClick={() => handleDeleteDoc(d.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Calendario */}
        <div style={{ border: '1px solid #333', padding: '1rem', background: '#000' }}>
          <h2>Eventos de Calendario</h2>
          <hr style={{ borderColor: '#333', marginBottom: '1rem' }} />
          
          <form onSubmit={handleAddEvent} style={{ marginBottom: '2rem', border: '1px dashed #333', padding: '1rem' }}>
            <label>Fecha del Evento</label>
            <input required type="date" style={inputStyle} value={eventoModel.dateStr} onChange={e => setEventoModel({...eventoModel, dateStr: e.target.value})} />
            
            <label>Nombre del Evento</label>
            <input required style={inputStyle} value={eventoModel.title} onChange={e => setEventoModel({...eventoModel, title: e.target.value})} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Color</label>
                <input type="color" style={{...inputStyle, height: '40px', padding: '2px'}} value={eventoModel.color} onChange={e => setEventoModel({...eventoModel, color: e.target.value})} />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={eventoModel.isHoliday} onChange={e => setEventoModel({...eventoModel, isHoliday: e.target.checked})} />
                <label>¿Sin clases?</label>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#059669', color: '#fff', border: 'none', cursor: 'pointer' }}>Agregar Evento</button>
          </form>

          <div>
            <h3>Eventos Especiales ({eventos.length})</h3>
            {eventos.map(ev => (
              <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #333' }}>
                <div style={{ overflow: 'hidden' }}>
                  <strong style={{ color: ev.color }}>{ev.title}</strong><br/>
                  <small style={{ color: '#888' }}>{ev.dateStr} {ev.isHoliday ? '(Sin Clases)' : ''}</small>
                </div>
                <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
