import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Lista from './components/Lista'
import Formulario from './components/Formulario'
import Resumen from './components/Resumen'
import Login from './components/Login'
import Configuracion from './components/Configuracion'

export default function App() {
  const [movimientos, setMovimientos] = useState([])
  const [pantalla, setPantalla] = useState('lista')
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [movEditando, setMovEditando] = useState(null)
  const [mostrarConfig, setMostrarConfig] = useState(false)
  // Agregá estos estados junto a los otros useState
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth())
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear())

  function cambiarMes(m, a) {
    setMesFiltro(m)
    setAnioFiltro(a)
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      setCargando(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (usuario) cargarMovimientos()
  }, [usuario])

  async function cargarMovimientos() {
    const { data } = await supabase
      .from('movimientos')
      .select('*')
      .order('fecha', { ascending: false })
    setMovimientos(data || [])
  }

  async function eliminarMovimiento(id) {
    await supabase.from('movimientos').delete().eq('id', id)
    cargarMovimientos()
  }

  async function agregarMovimiento(mov) {
    await supabase.from('movimientos').insert([{ ...mov, user_id: usuario.id }])
    cargarMovimientos()
    setPantalla('lista')
  }

  async function editarMovimiento(id, datos) {
    await supabase.from('movimientos').update(datos).eq('id', id)
    cargarMovimientos()
  }

  async function marcarRealizado(id) {
    await supabase.from('movimientos').update({ estado: 'realizado' }).eq('id', id)
    cargarMovimientos()
  }

  async function repetirMovimiento(mov) {
    const fecha = new Date(mov.fecha)
    fecha.setMonth(fecha.getMonth() + 1)
    const nuevaFecha = fecha.toISOString().split('T')[0]
    await supabase.from('movimientos').insert([{
      tipo: mov.tipo, categoria: mov.categoria,
      descripcion: mov.descripcion, estado: 'pendiente',
      monto: mov.monto, metodo: mov.metodo,
      fecha: nuevaFecha, user_id: usuario.id
    }])
    cargarMovimientos()
  }

  if (cargando) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A3C34' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#AAEB4E', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!usuario) return <Login />

  const enLista = pantalla === 'lista'

  return (
    <div style={{ width: '100%', height: '100vh', background: '#1A3C34', display: 'flex', flexDirection: 'column' }}>

      {mostrarConfig && (
        <Configuracion usuario={usuario} onCerrar={() => setMostrarConfig(false)} />
      )}

      {!mostrarConfig && (
        <>
          {pantalla !== 'formulario' && !movEditando && (
            <div style={{ width: '100%', height: '100vh', background: '#1A3C34', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button onClick={() => setMostrarConfig(true)} style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          )}

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {pantalla === 'formulario' && (
              <Formulario onGuardar={agregarMovimiento} onCancelar={() => setPantalla('lista')} />
            )}
            {pantalla === 'lista' && movEditando && (
              <Formulario
                movimientoEditar={movEditando}
                onGuardar={async (datos) => {
                  await editarMovimiento(movEditando.id, datos)
                  setMovEditando(null)
                }}
                onCancelar={() => setMovEditando(null)}
              />
            )}
            {pantalla === 'lista' && !movEditando && (
              <Lista
                movimientos={movimientos}
                onEliminar={eliminarMovimiento}
                onMarcarRealizado={marcarRealizado}
                onRepetir={repetirMovimiento}
                onEditarClick={setMovEditando}
                mes={mesFiltro}
                anio={anioFiltro}
                onCambiarMes={cambiarMes}
              />
            )}
            {pantalla === 'resumen' && (
              <Resumen
                movimientos={movimientos}
                mes={mesFiltro}
                anio={anioFiltro}
                onCambiarMes={cambiarMes}
              />
            )}
          </div>

          {pantalla !== 'formulario' && !movEditando && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 20px 16px', background: '#1A3C34',
              borderTop: '0.5px solid rgba(255,255,255,0.1)', flexShrink: 0,
            }}>
              <button
                onClick={() => setPantalla(enLista ? 'resumen' : 'lista')}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {enLista
                  ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                }
              </button>

              <button
                onClick={() => setPantalla('formulario')}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none',
                  background: '#AAEB4E', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A3C34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}