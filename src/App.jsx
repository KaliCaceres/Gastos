import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Lista from './components/Lista'
import Formulario from './components/Formulario'
import Resumen from './components/Resumen'

const iconoStats = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)

const iconoLista = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

export default function App() {
  const [movimientos, setMovimientos] = useState([])
  const [pantalla, setPantalla] = useState('lista')

  useEffect(() => {
    cargarMovimientos()
  }, [])

async function cargarMovimientos() {
  const { data, error } = await supabase
    .from('movimientos')
    .select('*')
    .order('fecha', { ascending: false })
  if (error) console.log('error:', error.message)
  else console.log('data:', data)
  setMovimientos(data || [])
}

  async function eliminarMovimiento(id) {
    await supabase.from('movimientos').delete().eq('id', id)
    cargarMovimientos()
  }

  async function agregarMovimiento(mov) {
    await supabase.from('movimientos').insert([mov])
    cargarMovimientos()
    setPantalla('lista')
  }

  const enLista = pantalla === 'lista'

  return (
    <div style={{ width: '100%', height: '100vh', background: '#F7F5F2', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {pantalla === 'formulario' && (
          <Formulario onGuardar={agregarMovimiento} onCancelar={() => setPantalla('lista')} />
        )}
        {pantalla === 'lista' && (
          <Lista movimientos={movimientos} onEliminar={eliminarMovimiento} />
        )}
        {pantalla === 'resumen' && <Resumen movimientos={movimientos} />}
      </div>

      {pantalla !== 'formulario' && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 20px 16px',
          background: '#F7F5F2',
          borderTop: '0.5px solid #e5e5e5',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setPantalla(enLista ? 'resumen' : 'lista')}
            style={{
              width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: enLista ? '#FFD6D6' : '#D6EDDA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {enLista ? iconoStats : iconoLista}
          </button>

          <button
            onClick={() => setPantalla('formulario')}
            style={{
              width: 52, height: 52, borderRadius: '50%', border: 'none',
              background: '#333', color: '#fff', fontSize: 28, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >+</button>
        </div>
      )}
    </div>
  )
}