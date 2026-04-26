import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { ArrowLeft, Trash2, Bell, FileText, Calendar, Users, MessageSquare, LogOut } from 'lucide-react';

interface AdminPanelProps { onBack: () => void; }

const AUTHORIZED_EMAIL = 'agustinvegabrunetto7@gmail.com';

type Tab = 'anuncios' | 'actas' | 'eventos' | 'logins' | 'contactos';

const inp: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', background: '#1a1a2e', border: '1px solid #333', color: '#fff', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '0.75rem' };
const btn = (color: string): React.CSSProperties => ({ padding: '0.5rem 1rem', background: color, border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' });

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('anuncios');

  // Collections
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [logins, setLogins] = useState<any[]>([]);
  const [contactos, setContactos] = useState<any[]>([]);

  // Forms
  const [anuncioModel, setAnuncioModel] = useState({ title: '', subtitle: '', details: '', tagPrecio: '', tagHora: '', tagLugar: '', tagQuienes: '', tagObligatorio: false });
  const [docModel, setDocModel] = useState({ title: '', status: 'Aprobada', url: '' });
  const [eventoModel, setEventoModel] = useState({ title: '', dateStr: '', color: '#ef4444', isHoliday: true });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.email === AUTHORIZED_EMAIL) { setUser(u); setError(''); }
        else { signOut(auth); setError('Email no autorizado.'); }
      } else { setUser(null); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const subs = [
      onSnapshot(query(collection(db, 'anuncios'), orderBy('createdAt', 'desc')), s => setAnuncios(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'documentos'), s => setDocumentos(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'eventos'), s => setEventos(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'logins'), s => setLogins(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'contactos'), orderBy('enviadoEn', 'desc')), s => setContactos(s.docs.map(d => ({ id: d.id, ...d.data() })))),
    ];
    return () => subs.forEach(u => u());
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user.email !== AUTHORIZED_EMAIL) { await signOut(auth); setError('Email no autorizado.'); }
    } catch (e: any) { setError(e.message); }
  };

  const addAnuncio = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'anuncios'), { ...anuncioModel, createdAt: serverTimestamp() });
    setAnuncioModel({ title: '', subtitle: '', details: '', tagPrecio: '', tagHora: '', tagLugar: '', tagQuienes: '', tagObligatorio: false });
  };

  const addDoc2 = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'documentos'), { ...docModel, date: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) });
    setDocModel({ title: '', status: 'Aprobada', url: '' });
  };

  const addEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'eventos'), eventoModel);
    setEventoModel({ title: '', dateStr: '', color: '#ef4444', isHoliday: true });
  };

  const del = (col: string, id: string) => { if (confirm('¿Eliminar?')) deleteDoc(doc(db, col, id)); };

  const tabConfig: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'anuncios', label: 'Anuncios', icon: <Bell size={15} />, count: anuncios.length },
    { id: 'actas', label: 'Actas', icon: <FileText size={15} />, count: documentos.length },
    { id: 'eventos', label: 'Eventos', icon: <Calendar size={15} />, count: eventos.length },
    { id: 'logins', label: 'Logins', icon: <Users size={15} />, count: logins.length },
    { id: 'contactos', label: 'Contactos', icon: <MessageSquare size={15} />, count: contactos.length },
  ];

  const s = { background: '#0a0a14', color: '#e2e8f0', minHeight: '100vh', padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.875rem' };

  if (loading) return <div style={s}>Cargando...</div>;

  if (!user) return (
    <div style={{ ...s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '380px', width: '100%', border: '1px solid #222', borderRadius: '16px', padding: '2rem', background: '#111' }}>
        <button onClick={onBack} style={{ ...btn('#222'), marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ArrowLeft size={14} /> Volver</button>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>Panel de Administración</h2>
        <p style={{ color: '#666', margin: '0 0 1.5rem', fontSize: '0.8rem' }}>Solo usuarios autorizados.</p>
        {error && <div style={{ background: '#2a0000', border: '1px solid #600', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: '#f87171', fontSize: '0.82rem' }}>{error}</div>}
        <button onClick={handleGoogleLogin} style={{ ...btn('#fff'), color: '#111', width: '100%', padding: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>G</span> Continuar con Google
        </button>
      </div>
    </div>
  );

  return (
    <div style={s}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ ...btn('#1e1e2e'), display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ArrowLeft size={14} /></button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Admin — CEGA</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>{user.email}</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} style={{ ...btn('#2a0000'), display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171' }}><LogOut size={14} /> Salir</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabConfig.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.875rem', border: '1px solid', borderColor: activeTab === t.id ? '#4f46e5' : '#222', background: activeTab === t.id ? 'rgba(79,70,229,0.2)' : '#111', color: activeTab === t.id ? '#818cf8' : '#666', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeTab === t.id ? 700 : 400 }}>
            {t.icon}{t.label}
            {t.count !== undefined && <span style={{ background: activeTab === t.id ? '#4f46e5' : '#222', color: activeTab === t.id ? '#fff' : '#888', borderRadius: '100px', padding: '0 0.4rem', fontSize: '0.72rem' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── ANUNCIOS ── */}
      {activeTab === 'anuncios' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Nuevo Anuncio</h3>
            <form onSubmit={addAnuncio}>
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Título *</label>
              <input required style={inp} value={anuncioModel.title} onChange={e => setAnuncioModel({ ...anuncioModel, title: e.target.value })} />
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Subtítulo</label>
              <input style={inp} value={anuncioModel.subtitle} onChange={e => setAnuncioModel({ ...anuncioModel, subtitle: e.target.value })} />
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Descripción *</label>
              <textarea required style={{ ...inp, minHeight: '80px', resize: 'vertical' }} value={anuncioModel.details} onChange={e => setAnuncioModel({ ...anuncioModel, details: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div><label style={{ color: '#888', fontSize: '0.78rem' }}>Precio</label><input style={inp} placeholder="Ej: $2000" value={anuncioModel.tagPrecio} onChange={e => setAnuncioModel({ ...anuncioModel, tagPrecio: e.target.value })} /></div>
                <div><label style={{ color: '#888', fontSize: '0.78rem' }}>Hora</label><input style={inp} placeholder="Ej: 20:00hs" value={anuncioModel.tagHora} onChange={e => setAnuncioModel({ ...anuncioModel, tagHora: e.target.value })} /></div>
                <div><label style={{ color: '#888', fontSize: '0.78rem' }}>Lugar</label><input style={inp} placeholder="Ej: SUM" value={anuncioModel.tagLugar} onChange={e => setAnuncioModel({ ...anuncioModel, tagLugar: e.target.value })} /></div>
                <div><label style={{ color: '#888', fontSize: '0.78rem' }}>¿Quiénes?</label><input style={inp} placeholder="Ej: Delegados" value={anuncioModel.tagQuienes} onChange={e => setAnuncioModel({ ...anuncioModel, tagQuienes: e.target.value })} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.82rem', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={anuncioModel.tagObligatorio} onChange={e => setAnuncioModel({ ...anuncioModel, tagObligatorio: e.target.checked })} />
                Asistencia Obligatoria
              </label>
              <button type="submit" style={{ ...btn('#4f46e5'), width: '100%', padding: '0.625rem' }}>+ Publicar Anuncio</button>
            </form>
          </div>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111', overflowY: 'auto', maxHeight: '600px' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Publicados ({anuncios.length})</h3>
            {anuncios.length === 0 && <p style={{ color: '#555' }}>Sin anuncios aún.</p>}
            {anuncios.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem', borderBottom: '1px solid #1e1e2e', gap: '0.5rem' }}>
                <div style={{ overflow: 'hidden' }}>
                  <strong style={{ color: '#e2e8f0' }}>{a.title}</strong>
                  {a.subtitle && <p style={{ margin: '0.2rem 0 0', color: '#666', fontSize: '0.8rem' }}>{a.subtitle}</p>}
                  <p style={{ margin: '0.2rem 0 0', color: '#555', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.details}</p>
                </div>
                <button onClick={() => del('anuncios', a.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', flexShrink: 0 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTAS ── */}
      {activeTab === 'actas' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Nueva Acta</h3>
            <form onSubmit={addDoc2}>
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Título *</label>
              <input required style={inp} value={docModel.title} onChange={e => setDocModel({ ...docModel, title: e.target.value })} />
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Estado</label>
              <select style={inp} value={docModel.status} onChange={e => setDocModel({ ...docModel, status: e.target.value })}>
                <option value="Aprobada">Aprobada</option>
                <option value="Revisión">Revisión</option>
                <option value="Enviada">Enviada</option>
              </select>
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Enlace de Google Drive *</label>
              <input required type="url" style={inp} value={docModel.url} onChange={e => setDocModel({ ...docModel, url: e.target.value })} />
              <button type="submit" style={{ ...btn('#0d9488'), width: '100%', padding: '0.625rem' }}>+ Agregar Acta</button>
            </form>
          </div>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111', overflowY: 'auto', maxHeight: '600px' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Archivos ({documentos.length})</h3>
            {documentos.length === 0 && <p style={{ color: '#555' }}>Sin actas aún.</p>}
            {documentos.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #1e1e2e' }}>
                <div>
                  <strong style={{ color: '#e2e8f0' }}>{d.title}</strong>
                  <p style={{ margin: '0.2rem 0 0', color: '#666', fontSize: '0.78rem' }}>{d.date} — {d.status}</p>
                </div>
                <button onClick={() => del('documentos', d.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EVENTOS ── */}
      {activeTab === 'eventos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Nuevo Evento</h3>
            <form onSubmit={addEvento}>
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Fecha *</label>
              <input required type="date" style={inp} value={eventoModel.dateStr} onChange={e => setEventoModel({ ...eventoModel, dateStr: e.target.value })} />
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Nombre *</label>
              <input required style={inp} value={eventoModel.title} onChange={e => setEventoModel({ ...eventoModel, title: e.target.value })} />
              <label style={{ color: '#888', fontSize: '0.78rem' }}>Color</label>
              <input type="color" style={{ ...inp, height: '38px', padding: '2px' }} value={eventoModel.color} onChange={e => setEventoModel({ ...eventoModel, color: e.target.value })} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.82rem', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={eventoModel.isHoliday} onChange={e => setEventoModel({ ...eventoModel, isHoliday: e.target.checked })} />
                ¿Sin clases?
              </label>
              <button type="submit" style={{ ...btn('#059669'), width: '100%', padding: '0.625rem' }}>+ Agregar Evento</button>
            </form>
          </div>
          <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111', overflowY: 'auto', maxHeight: '600px' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Eventos ({eventos.length})</h3>
            {eventos.length === 0 && <p style={{ color: '#555' }}>Sin eventos aún.</p>}
            {eventos.map(ev => (
              <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #1e1e2e' }}>
                <div>
                  <strong style={{ color: ev.color }}>{ev.title}</strong>
                  <p style={{ margin: '0.2rem 0 0', color: '#666', fontSize: '0.78rem' }}>{ev.dateStr} {ev.isHoliday ? '· Sin Clases' : ''}</p>
                </div>
                <button onClick={() => del('eventos', ev.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LOGINS ── */}
      {activeTab === 'logins' && (
        <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Registro de Logins ({logins.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a3e', color: '#555' }}>
                  {['ID', 'Nombre', 'Apellido', 'Curso', 'Div', 'Fecha', 'Hora', 'IP', 'Location'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logins.length === 0 && <tr><td colSpan={9} style={{ padding: '1rem', color: '#555' }}>Sin registros.</td></tr>}
                {logins.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #1a1a2a' }}>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#4f46e5', fontSize: '0.75rem' }}>{l.id}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#e2e8f0' }}>{l.Nombre}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#e2e8f0' }}>{l.Apellido}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>{l.Curso}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>{l.Division}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{l.Fecha}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{l.Hora}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#64748b', fontSize: '0.75rem' }}>{l.IP}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#64748b', fontSize: '0.75rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.Location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CONTACTOS ── */}
      {activeTab === 'contactos' && (
        <div style={{ border: '1px solid #1e1e2e', borderRadius: '12px', padding: '1.25rem', background: '#111' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#818cf8' }}>Mensajes Recibidos ({contactos.length})</h3>
          {contactos.length === 0 && <p style={{ color: '#555' }}>Sin mensajes aún.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contactos.map(c => {
              const isDelicate = c.tipo === 'delicada';
              return (
                <div key={c.id} style={{ border: `1px solid ${isDelicate ? '#3a1515' : '#151530'}`, borderRadius: '10px', padding: '1rem', background: isDelicate ? '#1a0a0a' : '#0a0a1a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ background: isDelicate ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: isDelicate ? '#f87171' : '#60a5fa', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {isDelicate ? '🔴 Situación Delicada' : '🔵 Sugerencia / Reclamo'}
                    </span>
                    <span style={{ color: '#444', fontSize: '0.72rem' }}>{c.enviadoEn?.toDate?.()?.toLocaleString('es-AR') ?? '—'}</span>
                  </div>
                  <p style={{ margin: '0 0 0.25rem', fontWeight: 700, color: '#e2e8f0' }}>Tema: {c.tema}</p>
                  <p style={{ margin: '0 0 0.75rem', color: '#94a3b8', lineHeight: 1.5, fontSize: '0.85rem' }}>{c.descripcion}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#555' }}>
                    {c.anonimo ? '👤 Anónimo' : c.remitente ? `👤 ${c.remitente.nombre} ${c.remitente.apellido} — ${c.remitente.curso}° ${c.remitente.division}` : '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
