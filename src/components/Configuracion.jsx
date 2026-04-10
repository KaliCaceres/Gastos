import { supabase } from '../supabase'
import { useTema } from '../TemaContext'
import { TEMAS } from '../tema'

export default function Configuracion({ usuario, onCerrar }) {
  const { tema, temaKey, setTemaKey } = useTema()

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  const iniciales = usuario?.user_metadata?.full_name
    ? usuario.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : usuario?.email?.slice(0, 2).toUpperCase() || '?'

  const nombre = usuario?.user_metadata?.full_name || 'Usuario'
  const email  = usuario?.email || ''

  const puntosColores = {
    bosque:  ['#B91C1C', '#15803D', '#AAEB4E'],
    galaxia: ['#DC2626', '#7C3AED', '#A78BFA'],
    noche:   ['#DC2626', '#059669', '#60A5FA'],
    dia:     ['#C0392B', '#27AE60', '#F5C842'],
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: tema.fondo }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, flexShrink: 0 }}>
        <button onClick={onCerrar} style={{ background: 'none', border: 'none', color: tema.textoSub, fontSize: 22, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: tema.texto }}>Configuración</span>
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 20px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: tema.acento, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: tema.acentoTexto, marginBottom: 12 }}>
          {iniciales}
        </div>
        <p style={{ fontSize: 18, fontWeight: 600, color: tema.texto, marginBottom: 4 }}>{nombre}</p>
        <p style={{ fontSize: 13, color: tema.textoSub }}>{email}</p>
      </div>

      {/* Temas */}
      <div style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: tema.textoSub, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Tema</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(TEMAS).map(([key, t]) => {
            const sel = temaKey === key
            const esDia = key === 'dia'
            return (
              <button key={key} onClick={() => setTemaKey(key)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                background: t.fondo,
                border: sel ? `2px solid ${t.acento}` : esDia ? '1.5px solid rgba(0,0,0,0.1)' : '2px solid transparent',
                WebkitTapHighlightColor: 'transparent',
              }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: t.texto, margin: 0 }}>{t.nombre}</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {puntosColores[key].map((c, i) => (
                    <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: c }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cerrar sesión */}
      <div style={{ padding: '16px 16px 32px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={cerrarSesion} style={{
          padding: '15px 32px', borderRadius: 99,
          border: '1px solid rgba(185,28,28,0.5)',
          background: 'rgba(185,28,28,0.3)', color: '#FF6B6B',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}