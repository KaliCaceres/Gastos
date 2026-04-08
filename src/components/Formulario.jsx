import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { IconoSVG } from './NuevaCategoria'

const estiloAnimaciones = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .paso-contenido { animation: fadeSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
  .fondo-paso     { transition: background 0.5s cubic-bezier(0.22,1,0.36,1); }
`

const pasosFijos = [
  { campo: 'tipo',        titulo: '¿Qué tipo de movimiento?', subtitulo: 'Seleccioná una opción',  color: '#6C63FF', opciones: ['egreso','ingreso'], tipo: 'opciones' },
  { campo: 'categoria',   titulo: '¿Qué categoría?',          subtitulo: 'Seleccioná una opción',  color: '#E8776A', tipo: 'categorias' },
  { campo: 'descripcion', titulo: '¿Qué fue?',                subtitulo: 'Agregá una descripción', color: '#5BB8A8', placeholder: 'Ej: Almuerzo en el trabajo', tipo: 'texto' },
  { campo: 'estado',      titulo: '¿Cuál es el estado?',      subtitulo: 'Seleccioná una opción',  color: '#E8A45A', opciones: ['realizado','pendiente'], tipo: 'opciones' },
  { campo: 'monto',       titulo: '¿Cuánto?',                 subtitulo: 'Ingresá el importe',     color: '#7B8FD4', placeholder: '0', tipo: 'numero' },
  { campo: 'metodo',      titulo: '¿Cómo pagaste?',           subtitulo: 'Seleccioná el método',   color: '#A07CC5', opciones: ['Efectivo','Transferencia'], tipo: 'opciones' },
]

export default function Formulario({ onGuardar, onCancelar }) {
  const [current, setCurrent]       = useState(0)
  const [form, setForm]             = useState({ tipo: '', categoria: '', descripcion: '', estado: '', monto: '', metodo: '', fecha: new Date().toISOString().split('T')[0] })
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda]     = useState('')

  useEffect(() => { cargarCategorias() }, [])

  async function cargarCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    setCategorias(data || [])
  }

  const paso  = pasosFijos[current]
  const total = pasosFijos.length

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

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
<div className="fondo-paso" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '60px 28px 28px', textAlign: 'center', position: 'relative', background: paso.color, overflowY: 'auto' }}>      <style>{estiloAnimaciones}</style>

      {/* Flecha atrás */}
      <button onClick={anterior} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', opacity: 0.85 }}>←</button>

      {/* Puntos */}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 6 }}>
        {pasosFijos.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === current ? '#fff' : 'rgba(255,255,255,0.35)' }} />
        ))}
      </div>

      {/* Contenido animado */}
      <div key={current} className="paso-contenido" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          PASO {current + 1} DE {total}
        </p>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
          {paso.titulo}
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 32 }}>
          {paso.subtitulo}
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Opciones simples */}
          {paso.tipo === 'opciones' && paso.opciones.map(op => (
            <button key={op} onClick={() => seleccionar(op)} style={{
              padding: '16px 20px', borderRadius: 99,
              border: '2px solid rgba(255,255,255,0.4)',
              WebkitTapHighlightColor: 'transparent',
              background: form[paso.campo] === op ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.15)',
              color: form[paso.campo] === op ? '#333' : '#fff',
              fontSize: 16, fontWeight: form[paso.campo] === op ? 500 : 400,
              cursor: 'pointer', textTransform: 'capitalize',
            }}>
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}

          {/* Categorías con buscador */}
          {paso.tipo === 'categorias' && (
            <>
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{
                  width: '100%', padding: '14px 20px',
                  borderRadius: 99, border: 'none',
                  fontSize: 15, background: 'rgba(255,255,255,0.92)',
                  color: '#333', outline: 'none', textAlign: 'center',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                {categoriasFiltradas.map(cat => {
                  const sel = form.categoria === cat.nombre
                  return (
                    <button key={cat.id} onClick={() => seleccionar(cat.nombre)} style={{
                      padding: '16px 20px', borderRadius: 99,
                      border: '2px solid rgba(255,255,255,0.4)',
                      background: sel ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.15)',
                      color: sel ? '#333' : '#fff',
                      WebkitTapHighlightColor: 'transparent',
                      fontSize: 16, fontWeight: sel ? 500 : 400,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <IconoSVG icono={cat.icono} color={sel ? '#333' : '#fff'} size={18} />
                      {cat.nombre}
                    </button>
                  )
                })}

                {categoriasFiltradas.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, padding: '12px 0' }}>
                    Sin resultados
                  </p>
                )}
              </div>
            </>
          )}

          {/* Texto / número */}
          {(paso.tipo === 'texto' || paso.tipo === 'numero') && (
            <input
              type={paso.tipo === 'numero' ? 'number' : 'text'}
              value={form[paso.campo]}
              onChange={handleInput}
              placeholder={paso.placeholder}
              style={{
                width: '100%', padding: '18px 20px',
                borderRadius: 99, border: 'none',
                fontSize: 17, background: 'rgba(255,255,255,0.92)',
                color: '#333', outline: 'none', textAlign: 'center',
              }}
            />
          )}
        </div>

        {/* Botón siguiente */}
        <button onClick={siguiente} disabled={vacio} style={{
          width: '100%', padding: 18, borderRadius: 99,
          border: 'none',
          WebkitTapHighlightColor: 'transparent',
          background: vacio ? 'rgba(30,20,60,0.3)' : 'rgba(30,20,60,0.75)',
          color: vacio ? 'rgba(255,255,255,0.4)' : '#fff',
          fontSize: 16, fontWeight: 500,
          cursor: vacio ? 'not-allowed' : 'pointer',
          marginTop: 16, transition: 'all 0.2s',
        }}>
          {esUltimo ? 'GUARDAR ✓' : 'SIGUIENTE →'}
        </button>

      </div>
    </div>
  )
}