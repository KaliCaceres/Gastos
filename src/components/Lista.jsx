import { useState, useRef } from 'react'
import { useTema } from '../TemaContext'

const catIconos = {
  Comida: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  Ropa: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Default: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
}

const iconoBasura = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function fmt(n) { return '$' + Math.abs(Math.round(n)).toLocaleString('es-AR') }

function fmtFecha(f) {
  if (!f) return ''
  const [y, m, d] = f.split('-')
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${parseInt(d)} ${meses[parseInt(m)-1]}`
}

function esMismaFecha(f1, f2) {
  if (!f1 || !f2) return false
  return f1.slice(0, 10) === f2.slice(0, 10)
}

function esHoy(f) {
  if (!f) return false
  return f.slice(0, 10) === new Date().toISOString().slice(0, 10)
}

function SeparadorFecha({ fecha, tema }) {
  const label = esHoy(fecha) ? `Hoy — ${fmtFecha(fecha)}` : fmtFecha(fecha)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 4px 8px' }}>
      <div style={{ flex: 1, height: 0.5, background: tema.borde }} />
      <span style={{ fontSize: 10, fontWeight: 600, color: tema.textoSub, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 0.5, background: tema.borde }} />
    </div>
  )
}

function EmptyState({ mes, tema }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 32, textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24, background: tema.superficie,
        border: `1.5px dashed ${tema.bordeDash}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={tema.textoSub} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      </div>
      <p style={{ fontSize: 20, fontWeight: 500, color: tema.texto, marginBottom: 8 }}>Sin movimientos en {mes.toLowerCase()}</p>
      <p style={{ fontSize: 14, color: tema.textoSub, lineHeight: 1.6 }}>Todavía no registraste<br />nada este mes.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 32 }}>
        <div style={{ width: 28, height: 1, background: tema.borde }} />
        <span style={{ fontSize: 12, color: tema.textoSub }}>usá las flechas para cambiar de mes</span>
        <div style={{ width: 28, height: 1, background: tema.borde }} />
      </div>
    </div>
  )
}

function MovimientoCard({ m, onConfirmarEliminar, onAbrir, tema }) {
  const cardRef         = useRef(null)
  const bgRef           = useRef(null)
  const snappedRef      = useRef(false)
  const draggingRef     = useRef(false)
  const startXRef       = useRef(0)
  const startYRef       = useRef(0)
  const currentXRef     = useRef(0)
  const isHorizontalRef = useRef(null)
  const movedRef        = useRef(false)
  const SNAP = -88

  const Icono     = catIconos[m.categoria] || catIconos.Default
  const pendiente = m.estado === 'pendiente'

  const estiloCard = m.tipo === 'egreso'
    ? pendiente
      ? { background: `rgba(${hexToRgb(tema.egreso)},0.35)`, border: `1.5px dashed ${tema.bordeDash}` }
      : { background: tema.egreso, boxShadow: `0 5px 0px ${tema.egresoSombra}`, borderTop: '1px solid rgba(255,255,255,0.12)' }
    : pendiente
      ? { background: `rgba(${hexToRgb(tema.ingreso)},0.35)`, border: `1.5px dashed ${tema.bordeDash}` }
      : { background: tema.ingreso, boxShadow: `0 5px 0px ${tema.ingresoSombra}`, borderTop: '1px solid rgba(255,255,255,0.12)' }

  function setX(x, animated) {
    const card = cardRef.current, bg = bgRef.current
    if (!card) return
    const dur = '0.25s cubic-bezier(0.22,1,0.36,1)'
    card.style.transition = animated ? `transform ${dur}` : 'none'
    card.style.transform  = x === 0 ? '' : `translateX(${x}px)`
    if (bg) bg.style.opacity = x < -20 ? '1' : '0'
  }

  function onStart(x, y) {
    startXRef.current = x; startYRef.current = y
    draggingRef.current = true; isHorizontalRef.current = null; movedRef.current = false
    currentXRef.current = snappedRef.current ? SNAP : 0
    setX(currentXRef.current, false)
  }

  function onMove(x, y) {
    if (!draggingRef.current) return
    const dx = x - startXRef.current, dy = y - startYRef.current
    if (isHorizontalRef.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5))
      isHorizontalRef.current = Math.abs(dx) > Math.abs(dy)
    if (!isHorizontalRef.current) return
    movedRef.current = true
    const base = snappedRef.current ? SNAP : 0
    const nx = Math.min(0, Math.max(-130, base + dx))
    currentXRef.current = nx
    const card = cardRef.current, bg = bgRef.current
    if (card) { card.style.transition = 'none'; card.style.transform = `translateX(${nx}px)`; }
    if (bg)   bg.style.opacity = nx < -20 ? '1' : '0'
  }

  function onEnd() {
    if (!draggingRef.current) return
    draggingRef.current = false
    if (!isHorizontalRef.current && !movedRef.current) { onAbrir(m); return }
    if (!isHorizontalRef.current) return
    if (currentXRef.current < -60) { snappedRef.current = true;  setX(SNAP, true) }
    else                           { snappedRef.current = false; setX(0, true) }
  }

  function onMouseMove(e) { onMove(e.clientX, e.clientY) }
  function onMouseUp() {
    if (draggingRef.current) onEnd()
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  return (
    <div style={{ position: 'relative', paddingBottom: 8, marginBottom: 2, touchAction: 'pan-y' }}>
      <div ref={bgRef} onClick={() => onConfirmarEliminar(m.id)} style={{
        position: 'absolute', top: 0, right: 0, bottom: 8, width: 80, borderRadius: 14,
        background: 'linear-gradient(145deg,#FF6B6B,#E74C3C)',
        boxShadow: '0 5px 0px #B03A2E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer',
      }}>
        {iconoBasura}
      </div>
      <div
        ref={cardRef}
        style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', willChange: 'transform', ...estiloCard }}
        onTouchStart={e => onStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e  => onMove(e.touches[0].clientX,  e.touches[0].clientY)}
        onTouchEnd={() => onEnd()}
        onMouseDown={e => { onStart(e.clientX, e.clientY); window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp); }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {Icono('rgba(255,255,255,0.8)')}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: pendiente ? 'rgba(255,255,255,0.7)' : '#fff' }}>{m.categoria}</p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{m.descripcion || '—'}</p>
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: pendiente ? 'rgba(255,255,255,0.6)' : '#fff', flexShrink: 0 }}>
          {m.tipo === 'ingreso' ? '+' : '-'}{fmt(m.monto)}
        </span>
      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

function ModalConfirmar({ id, onCerrar, onEliminar, tema }) {
  if (!id) return null
  return (
    <>
      <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: tema.fondo, borderRadius: '20px 20px 0 0', padding: '24px 20px 36px', zIndex: 11, textAlign: 'center' }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: tema.superficie, margin: '0 auto 20px' }} />
        <p style={{ fontSize: 18, fontWeight: 600, color: tema.texto, marginBottom: 8 }}>¿Eliminar movimiento?</p>
        <p style={{ fontSize: 14, color: tema.textoSub, marginBottom: 28 }}>Esta acción no se puede deshacer</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => { onEliminar(id); onCerrar(); }} style={{
            padding: 15, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: tema.egreso, color: '#fff', fontSize: 15, fontWeight: 600,
            WebkitTapHighlightColor: 'transparent',
          }}>Sí, eliminar</button>
          <button onClick={onCerrar} style={{
            padding: 15, borderRadius: 99, border: `1.5px solid ${tema.borde}`,
            background: 'transparent', color: tema.textoSub, fontSize: 15, fontWeight: 500,
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}>Cancelar</button>
        </div>
      </div>
    </>
  )
}

function Modal({ m, onCerrar, onMarcarRealizado, onRepetir, onEditarClick, tema }) {
  if (!m) return null
  const pendiente = m.estado === 'pendiente'
  const colorTipo = m.tipo === 'egreso' ? tema.egreso : tema.ingreso

  const badgeEstado = pendiente
    ? { background: `rgba(${hexToRgb(tema.egreso)},0.15)`, color: tema.egreso, border: `1px dashed ${tema.egreso}` }
    : { background: `rgba(${hexToRgb(tema.ingreso)},0.15)`, color: tema.ingreso }
  const badgeTipo = m.tipo === 'egreso'
    ? { background: `rgba(${hexToRgb(tema.egreso)},0.15)`, color: tema.egreso }
    : { background: `rgba(${hexToRgb(tema.ingreso)},0.15)`, color: tema.ingreso }

  const filas = [
    { label: 'Tipo',      content: <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, ...badgeTipo }}>{m.tipo.charAt(0).toUpperCase()+m.tipo.slice(1)}</span> },
    { label: 'Monto',     content: <span style={{ fontSize: 14, fontWeight: 500, color: colorTipo }}>{m.tipo==='ingreso'?'+':'-'}{fmt(m.monto)}</span> },
    { label: 'Estado',    content: <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, ...badgeEstado }}>{m.estado.charAt(0).toUpperCase()+m.estado.slice(1)}</span> },
    { label: 'Método',    content: <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{m.metodo}</span> },
    { label: 'Fecha',     content: <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{fmtFecha(m.fecha)}</span> },
    { label: 'Categoría', content: <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{m.categoria}</span> },
  ]

  const estiloAccion = (bg, color) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: '12px 8px', borderRadius: 14, border: 'none', cursor: 'pointer',
    fontSize: 11, fontWeight: 500, background: bg, color,
    boxShadow: '0 3px 0px rgba(0,0,0,0.08)',
    WebkitTapHighlightColor: 'transparent',
  })

  return (
    <>
      <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '20px 20px 0 0', padding: '12px 20px 32px', zIndex: 11 }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: '#ddd', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>{m.categoria} — {m.descripcion || '—'}</p>
        {filas.map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < filas.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
            <span style={{ fontSize: 13, color: '#888' }}>{f.label}</span>
            {f.content}
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: pendiente ? '1fr 1fr 1fr' : '1fr 1fr', gap: 8, marginTop: 16 }}>
          {pendiente && (
            <button style={estiloAccion('#D6EDDA', '#15803D')} onClick={() => { onMarcarRealizado(m.id); onCerrar(); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Marcar realizado
            </button>
          )}
          <button style={estiloAccion('#E8E4FF', '#6C63FF')} onClick={() => { onEditarClick(m); onCerrar(); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button style={estiloAccion('#FFF0E0', '#E8776A')} onClick={() => { onRepetir(m); onCerrar(); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8776A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Repetir mes
          </button>
        </div>
      </div>
    </>
  )
}

export default function Lista({ movimientos, onEliminar, onMarcarRealizado, onRepetir, onEditarClick, mes, anio, onCambiarMes }) {
  const { tema } = useTema()
  const [modalMov, setModalMov]       = useState(null)
  const [confirmarId, setConfirmarId] = useState(null)
  const [busqueda, setBusqueda]       = useState('')
  const [filtro, setFiltro]           = useState('todos')

  const estiloFlecha = {
    width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: tema.superficie, WebkitTapHighlightColor: 'transparent', flexShrink: 0,
  }

  const flechaIzq = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tema.textoSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  )

  const flechaDer = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tema.textoSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )

  function cambiarMes(dir) {
    let nm = mes + dir, na = anio
    if (nm > 11) { nm = 0;  na++ }
    if (nm < 0)  { nm = 11; na-- }
    onCambiarMes(nm, na)
  }

  const filtrados = movimientos.filter(m => {
    if (!m.fecha) return false
    const [y, mo] = m.fecha.split('-')
    const matchMes  = parseInt(mo) - 1 === mes && parseInt(y) === anio
    const matchTipo = filtro === 'todos' || m.tipo === filtro
    const matchQ    = !busqueda || m.categoria?.toLowerCase().includes(busqueda.toLowerCase()) || m.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    return matchMes && matchTipo && matchQ
  })

  const items = []
  let ultimaFecha = null
  filtrados.forEach(m => {
    if (!esMismaFecha(m.fecha, ultimaFecha)) {
      items.push({ tipo: 'separador', fecha: m.fecha })
      ultimaFecha = m.fecha
    }
    items.push({ tipo: 'movimiento', m })
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: tema.fondo }}>

      <div style={{ padding: '16px 16px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>

        <p style={{ fontSize: 22, fontWeight: 700, color: tema.texto }}>Movimientos</p>

        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 99,
            border: `1.5px solid ${tema.borde}`,
            background: tema.superficie,
            color: tema.texto, fontSize: 14, outline: 'none',
          }}
        />

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { key: 'todos',   label: 'Todos',    bg: tema.acento,   color: tema.acentoTexto },
            { key: 'egreso',  label: 'Egresos',  bg: tema.egreso,   color: '#fff' },
            { key: 'ingreso', label: 'Ingresos', bg: tema.ingreso,  color: '#fff' },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)} style={{
              padding: '6px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 500,
              border: filtro === f.key ? 'none' : `1.5px solid ${tema.borde}`,
              background: filtro === f.key ? f.bg : 'transparent',
              color: filtro === f.key ? f.color : tema.textoSub,
              WebkitTapHighlightColor: 'transparent', transition: 'all 0.15s',
            }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => cambiarMes(-1)} style={estiloFlecha}>{flechaIzq}</button>
          <span style={{ fontSize: 17, fontWeight: 600, color: tema.texto }}>{nombresMes[mes]} {anio}</span>
          <button onClick={() => cambiarMes(1)} style={estiloFlecha}>{flechaDer}</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '8px 12px 12px' }}>
          {filtrados.length === 0
            ? <EmptyState mes={nombresMes[mes]} tema={tema} />
            : items.map((item) =>
                item.tipo === 'separador'
                  ? <SeparadorFecha key={`sep-${item.fecha}`} fecha={item.fecha} tema={tema} />
                  : <MovimientoCard key={item.m.id} m={item.m} onConfirmarEliminar={setConfirmarId} onAbrir={setModalMov} tema={tema} />
              )
          }
        </div>
      </div>

      <Modal m={modalMov} onCerrar={() => setModalMov(null)} onMarcarRealizado={onMarcarRealizado} onRepetir={onRepetir} onEditarClick={(m) => { onEditarClick(m); setModalMov(null); }} tema={tema} />
      <ModalConfirmar id={confirmarId} onCerrar={() => setConfirmarId(null)} onEliminar={onEliminar} tema={tema} />
    </div>
  )
}