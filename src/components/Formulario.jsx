import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { IconoSVG } from './NuevaCategoria'
import { useTema } from '../TemaContext'

const estiloAnimaciones = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .paso-contenido { animation: fadeSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
  .fondo-paso     { transition: background 0.5s cubic-bezier(0.22,1,0.36,1); }
`

const PASOS = [
  { campo: 'tipo',        titulo: '¿Qué tipo de movimiento?', subtitulo: 'Seleccioná una opción',  opciones: ['egreso','ingreso'], tipo: 'opciones' },
  { campo: 'categoria',   titulo: '¿Qué categoría?',          subtitulo: 'Seleccioná una opción',  tipo: 'categorias' },
  { campo: 'descripcion', titulo: '¿Qué fue?',                subtitulo: 'Agregá una descripción', placeholder: 'Ej: Almuerzo en el trabajo', tipo: 'texto' },
  { campo: 'estado',      titulo: '¿Cuál es el estado?',      subtitulo: 'Seleccioná una opción',  opciones: ['realizado','pendiente'], tipo: 'opciones' },
  { campo: 'monto',       titulo: '¿Cuánto?',                 subtitulo: 'Ingresá el importe',     placeholder: '0', tipo: 'numero' },
  { campo: 'metodo',      titulo: null, subtitulo: null,      tipo: 'metodo' },
  { campo: 'fecha',       titulo: '¿Cuándo fue?',             subtitulo: 'Seleccioná la fecha',    tipo: 'fecha' },
]

export default function Formulario({ onGuardar, onCancelar, movimientoEditar }) {
  const { tema } = useTema()

  const COLOR_FONDO  = tema.fondo
  const COLOR_ACENTO = tema.acento
  const COLOR_TEXTO  = tema.acentoTexto

  const pasosFijos = PASOS.map(p => ({ ...p, color: COLOR_FONDO }))

  const estiloOpcion = (sel) => ({
    padding: '16px 20px', borderRadius: 99, cursor: 'pointer',
    fontSize: 15, fontWeight: sel ? 600 : 400,
    border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
    background: sel ? COLOR_ACENTO : 'rgba(255,255,255,0.08)',
    color: sel ? COLOR_TEXTO : 'rgba(255,255,255,0.85)',
    WebkitTapHighlightColor: 'transparent',
    display: 'flex', alignItems: 'center', gap: 10,
    justifyContent: 'center',
  })

  const [current, setCurrent]       = useState(0)
  const [form, setForm]             = useState(movimientoEditar || {
    tipo: '', categoria: '', descripcion: '', estado: '',
    monto: '', metodo: '', fecha: new Date().toISOString().split('T')[0]
  })
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda]     = useState('')

  useEffect(() => { cargarCategorias() }, [])

  async function cargarCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    setCategorias(data || [])
  }

  const paso      = pasosFijos[current]
  const total     = pasosFijos.length
  const esEdicion = !!movimientoEditar

  function seleccionar(valor) { setForm({ ...form, [paso.campo]: valor }) }
  function handleInput(e)     { setForm({ ...form, [paso.campo]: e.target.value }) }

  function siguiente() {
    setBusqueda('')
    if (current < total - 1) { setCurrent(current + 1) }
    else {
      if (!form.monto || isNaN(form.monto)) return
      onGuardar({ ...form, monto: parseFloat(form.monto) })
    }
  }

  function anterior() {
    setBusqueda('')
    if (current === 0) onCancelar()
    else setCurrent(current - 1)
  }

  const esUltimo = current === total - 1
  const vacio    = !form[paso.campo] || form[paso.campo].toString().trim() === ''

  const esIngreso      = form.tipo === 'ingreso'
  const tituloMetodo   = esIngreso ? '¿Cómo lo recibiste?' : '¿Cómo pagaste?'
  const opcionesMetodo = esIngreso
    ? ['Efectivo', 'Transferencia', 'Depósito']
    : ['Efectivo', 'Transferencia', 'Tarjeta']

  const categoriasFiltradas = [
    ...categorias.filter(cat => cat.nombre === form.categoria),
    ...categorias.filter(cat => cat.nombre !== form.categoria),
  ].filter(cat => cat.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="fondo-paso" style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-start', alignItems: 'center',
      padding: '60px 28px 28px', textAlign: 'center',
      position: 'relative', background: paso.color, overflowY: 'auto'
    }}>
      <style>{estiloAnimaciones}</style>

      <button onClick={anterior} style={{
        position: 'absolute', top: 20, left: 20,
        background: 'none', border: 'none',
        color: '#fff', fontSize: 24, cursor: 'pointer', opacity: 0.85,
        WebkitTapHighlightColor: 'transparent',
      }}>←</button>

      <div style={{ position: 'absolute', top: 24, right: 20, display: 'flex', gap: 6 }}>
        {pasosFijos.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i === current ? '#fff' : 'rgba(255,255,255,0.25)'
          }} />
        ))}
      </div>

      {esEdicion && (
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '4px 12px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>EDITANDO</span>
        </div>
      )}

      <div key={current} className="paso-contenido" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
          PASO {current + 1} DE {total}
        </p>

        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
          {paso.tipo === 'metodo' ? tituloMetodo : paso.titulo}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
          {paso.tipo === 'metodo' ? 'Seleccioná una opción' : paso.subtitulo}
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {paso.tipo === 'opciones' && paso.opciones.map(op => (
            <button key={op} onClick={() => seleccionar(op)} style={estiloOpcion(form[paso.campo] === op)}>
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}

          {paso.tipo === 'metodo' && opcionesMetodo.map(op => (
            <button key={op} onClick={() => seleccionar(op)} style={estiloOpcion(form.metodo === op)}>
              {op}
            </button>
          ))}

          {paso.tipo === 'categorias' && (
            <>
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{
                  width: '100%', padding: '14px 20px',
                  borderRadius: 99, border: '1.5px solid rgba(255,255,255,0.2)',
                  fontSize: 15, background: 'rgba(255,255,255,0.08)',
                  color: '#fff', outline: 'none', textAlign: 'center',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                {categoriasFiltradas.map(cat => {
                  const sel = form.categoria === cat.nombre
                  return (
                    <button key={cat.id} onClick={() => seleccionar(cat.nombre)} style={estiloOpcion(sel)}>
                      <IconoSVG icono={cat.icono} color={sel ? COLOR_TEXTO : 'rgba(255,255,255,0.85)'} size={18} />
                      {cat.nombre}
                    </button>
                  )
                })}
                {categoriasFiltradas.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, padding: '12px 0' }}>Sin resultados</p>
                )}
              </div>
            </>
          )}

          {(paso.tipo === 'texto' || paso.tipo === 'numero') && (
            <input
              type={paso.tipo === 'numero' ? 'number' : 'text'}
              value={form[paso.campo]}
              onChange={handleInput}
              placeholder={paso.placeholder}
              style={{
                width: '100%', padding: '18px 20px',
                borderRadius: 99, border: '1.5px solid rgba(255,255,255,0.2)',
                fontSize: 17, background: 'rgba(255,255,255,0.08)',
                color: '#fff', outline: 'none', textAlign: 'center',
              }}
            />
          )}

          {paso.tipo === 'fecha' && (
            <input
              type="text"
              inputMode="numeric"
              value={form.fecha}
              onChange={handleInput}
              placeholder="AAAA-MM-DD"
              style={{
                width: '100%', padding: '18px 20px',
                borderRadius: 99, border: '1.5px solid rgba(255,255,255,0.2)',
                fontSize: 17, background: 'rgba(255,255,255,0.08)',
                color: '#fff', outline: 'none', textAlign: 'center',
              }}
            />
          )}

        </div>

        <button onClick={siguiente} disabled={vacio} style={{
          width: '100%', padding: '17px 20px', borderRadius: 99,
          border: 'none',
          WebkitTapHighlightColor: 'transparent',
          background: vacio ? 'rgba(255,255,255,0.08)' : COLOR_ACENTO,
          color: vacio ? 'rgba(255,255,255,0.3)' : COLOR_TEXTO,
          fontSize: 16, fontWeight: 700,
          cursor: vacio ? 'not-allowed' : 'pointer',
          marginTop: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 0.2s',
        }}>
          {esUltimo ? 'GUARDAR' : 'SIGUIENTE'}
          {!vacio && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLOR_TEXTO} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          )}
        </button>

      </div>
    </div>
  )
}