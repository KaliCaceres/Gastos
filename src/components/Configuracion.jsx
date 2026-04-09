import { supabase } from '../supabase'

export default function Configuracion({ usuario, onCerrar }) {
  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  const iniciales = usuario?.user_metadata?.full_name
    ? usuario.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : usuario?.email?.slice(0, 2).toUpperCase() || '?'

  const nombre = usuario?.user_metadata?.full_name || 'Usuario'
  const email  = usuario?.email || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1A3C34' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, flexShrink: 0 }}>
        <button onClick={onCerrar} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Configuración</span>
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px 24px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#AAEB4E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, color: '#1A3C34', marginBottom: 12,
        }}>
          {iniciales}
        </div>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{nombre}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{email}</p>
      </div>

      <div style={{ flex: 1 }} />

      {/* Botón cerrar sesión */}
      <div style={{ padding: '16px 16px 32px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={cerrarSesion} style={{
          padding: '15px 32px', borderRadius: 99, border: '1px solid rgba(185,28,28,0.5)',
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