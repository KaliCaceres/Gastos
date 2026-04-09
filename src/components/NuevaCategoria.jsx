import { useState } from 'react'
import { supabase } from '../supabase'

export const ICONOS = {
  comida:          { label: 'Comida',        path: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>' },
  transporte:      { label: 'Transporte',    path: '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  salud:           { label: 'Salud',         path: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  ropa:            { label: 'Ropa',          path: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
  servicios:       { label: 'Servicios',     path: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>' },
  educacion:       { label: 'Educación',     path: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
  entretenimiento: { label: 'Entret.',       path: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>' },
  hogar:           { label: 'Hogar',         path: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  sueldo:          { label: 'Sueldo',        path: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  freelance:       { label: 'Freelance',     path: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  inversiones:     { label: 'Inversiones',   path: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  mascota:         { label: 'Mascota',       path: '<path d="M10 5.172C10 3.357 7.5 2 5 3c-2.5 1-3 4-1 6 1 1 2 2 3 2s2-1 3-2"/><path d="M14.267 5.172c0-1.815 2.5-3.172 5-2.172 2.5 1 3 4 1 6-1 1-2 2-3 2s-2-1-3-2"/><path d="M8 14v.5A3.5 3.5 0 0 0 11.5 18h1a3.5 3.5 0 0 0 3.5-3.5V14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2z"/><path d="M9 14h6"/>' },
  viajes:          { label: 'Viajes',        path: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>' },
  gimnasio:        { label: 'Gimnasio',      path: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M6 8H5a4 4 0 0 0 0 8h1"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="3" y1="8" x2="6" y2="8"/><line x1="18" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="6" y2="16"/><line x1="18" y1="16" x2="21" y2="16"/>' },
  otros:           { label: 'Otros',         path: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
suscripciones: { label: 'Suscripciones', path: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>' },
alimentos:     { label: 'Alimentos',     path: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/>' },
alquiler:      { label: 'Alquiler',      path: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
peluqueria:    { label: 'Peluquería',    path: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>' },
mascotas:      { label: 'Mascotas',      path: '<path d="M10 5.172C10 3.357 7.5 2 5 3c-2.5 1-3 4-1 6 1 1 2 2 3 2s2-1 3-2"/><path d="M14.267 5.172c0-1.815 2.5-3.172 5-2.172 2.5 1 3 4 1 6-1 1-2 2-3 2s-2-1-3-2"/><path d="M8 14v.5A3.5 3.5 0 0 0 11.5 18h1a3.5 3.5 0 0 0 3.5-3.5V14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2z"/><path d="M9 14h6"/>' },
}

export function IconoSVG({ icono, color = '#555', size = 20 }) {
  const def = ICONOS[icono] || ICONOS.otros
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: def.path }}
    />
  )
}

export default function NuevaCategoria({ onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [iconoSel, setIconoSel] = useState(null)
  const [guardando, setGuardando] = useState(false)

  async function guardar() {
    if (!nombre.trim() || !iconoSel) return
    setGuardando(true)
    const { data } = await supabase
      .from('categorias')
      .insert([{ nombre: nombre.trim(), icono: iconoSel }])
      .select()
      .single()
    setGuardando(false)
    if (data) onGuardar(data)
  }

  const listo = nombre.trim() && iconoSel

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F7F5F2' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '0.5px solid #e5e5e5', background: '#F7F5F2', flexShrink: 0 }}>
        <button onClick={onCancelar} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#555' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>Nueva categoría</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Nombre */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Mascota"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '0.5px solid #e0e0e0', background: '#fff', fontSize: 15, color: '#1a1a1a', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          />
        </div>

        {/* Iconos */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Elegí un icono</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {Object.entries(ICONOS).map(([id, def]) => {
              const sel = iconoSel === id
              return (
                <button key={id} onClick={() => setIconoSel(id)} style={{
                  aspectRatio: '1', borderRadius: 12, cursor: 'pointer',
                  border: sel ? '2px solid #6C63FF' : '2px solid transparent',
                  background: sel ? '#EEEDFE' : '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 8,
                }}>
                  <IconoSVG icono={id} color={sel ? '#6C63FF' : '#555'} size={22} />
                  <span style={{ fontSize: 9, color: sel ? '#6C63FF' : '#888', textAlign: 'center', lineHeight: 1.2 }}>{def.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px 32px', flexShrink: 0 }}>
        <button onClick={guardar} disabled={!listo || guardando} style={{
          width: '100%', padding: 15, borderRadius: 12, border: 'none',
          background: listo ? '#333' : '#ccc',
          color: '#fff', fontSize: 15, fontWeight: 500,
          cursor: listo ? 'pointer' : 'not-allowed',
        }}>
          {guardando ? 'Guardando...' : 'Guardar categoría'}
        </button>
      </div>
    </div>
  )
}