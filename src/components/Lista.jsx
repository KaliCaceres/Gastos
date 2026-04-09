import { useState, useRef } from 'react'

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

const flechaIzq = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const flechaDer = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
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

const estiloFlecha = {
  width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255,255,255,0.1)',
  WebkitTapHighlightColor: 'transparent',
  flexShrink: 0,
}

function getEstiloCard(tipo, estado) {
  const pendiente = estado === 'pendiente'
  if (tipo === 'egreso') {
    return pendiente
      ? { background: 'rgba(185,28,28,0.35)', border: '1.5px dashed rgba(255,255,255,0.25)' }
      : { background: '#B91C1C', boxShadow: '0 5px 0px #7F1D1D', borderTop: '1px solid rgba(255,255,255,0.12)' }
  }
  return pendiente
    ? { background: 'rgba(21,128,61,0.35)', border: '1.5px dashed rgba(255,255,255,0.25)' }
    : { background: '#15803D', boxShadow: '0 5px 0px #14532D', borderTop: '1px solid rgba(255,255,255,0.12)' }
}

function SeparadorFecha({ fecha }) {
  const label = esHoy(fecha) ? `Hoy — ${fmtFecha(fecha)}` : fmtFecha(fecha)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 4px 8px' }}>
      <div style={{ flex: 1, height: 0.5, background: 'rgba(255,255,255,0.15)' }} />
      <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 0.5, background: 'rgba(255,255,255,0.15)' }} />
    </div>
  )
}

function EmptyState({ mes }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 32, textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'rgba(255,255,255,0.08)',
        border: '1.5px dashed rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      </div>
      <p style={{ fontSize: 20, fontWeight: 500, color: '#fff', marginBottom: 8 }}>
        Sin movimientos en {mes.toLowerCase()}
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
        Todavía no registraste<br />nada este mes.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 32 }}>
        <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>usá las flechas para cambiar de mes</span>
        <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </div>
  )
}

function MovimientoCard({ m, onEliminar, onAbrir }) {
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

  const Icono = catIconos[m.categoria] || catIconos.Default
  const pendiente = m.estado === 'pendiente'
  const estiloCard = getEstiloCard(m.tipo, m.estado)
  const colorMonto = pendiente ? 'rgba(255,255,255,0.6)' : '#fff'

  function setX(x, animated) {
    const card = cardRef.current
    const bg   = bgRef.current
    if (!card) return
    const dur = '0.25s cubic-bezier(0.22,1,0.36,1)'
    card.style.transition = animated ? `transform ${dur}` : 'none'
    card.style.transform  = x === 0 ? '' : `translateX(${x}px)`
    if (bg) bg.style.opacity = x < -20 ? '1' : '0'
  }

  function onStart(x, y) {
    startXRef.current     = x
    startYRef.current     = y
    draggingRef.current   = true
    isHorizontalRef.current = null
    movedRef.current      = false
    currentXRef.current   = snappedRef.current ? SNAP : 0
    setX(currentXRef.current, false)
  }

  function onMove(x, y) {
    if (!draggingRef.current) return
    const dx = x - startXRef.current
    const dy = y - startYRef.current
    if (isHorizontalRef.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5))
      isHorizontalRef.current = Math.abs(dx) > Math.abs(dy)
    if (!isHorizontalRef.current) return
    movedRef.current = true
    const base = snappedRef.current ? SNAP : 0
    const nx = Math.min(0, Math.max(-130, base + dx))
    currentXRef.current = nx
    const card = cardRef.current
    const bg   = bgRef.current
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
      <div ref={bgRef} onClick={() => onEliminar(m.id)} style={{
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
        onMouseDown={e => {
          onStart(e.clientX, e.clientY)
          window.addEventListener('mousemove', onMouseMove)
          window.addEventListener('mouseup', onMouseUp)
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {Icono('rgba(255,255,255,0.8)')}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: pendiente ? 'rgba(255,255,255,0.7)' : '#fff' }}>{m.categoria}</p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{m.descripcion || '—'}</p>
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: colorMonto, flexShrink: 0 }}>
          {m.tipo === 'ingreso' ? '+' : '-'}{fmt(m.monto)}
        </span>
      </div>
    </div>
  )
}

function Modal({ m, onCerrar, onMarcarRealizado, onRepetir, onEditarClick }) {
  if (!m) return null
  const pendiente = m.estado === 'pendiente'
  const colorTipo = m.tipo === 'egreso' ? '#B91C1C' : '#15803D'

  const badgeEstado = pendiente
    ? { background: 'rgba(185,28,28,0.15)', color: '#B91C1C', border: '1px dashed #B91C1C' }
    : { background: '#D6EDDA', color: '#15803D' }
  const badgeTipo = m.tipo === 'egreso'
    ? { background: '#FFD6D6', color: '#B91C1C' }
    : { background: '#D6EDDA', color: '#15803D' }

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
        <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>
          {m.categoria} — {m.descripcion || '—'}
        </p>

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

export default function Lista({ movimientos, onEliminar, onMarcarRealizado, onRepetir, onEditarClick }) {
  const [modalMov, setModalMov] = useState(null)
  const [mes, setMes]           = useState(new Date().getMonth())
  const [anio, setAnio]         = useState(new Date().getFullYear())

  function cambiarMes(dir) {
    setMes(m => {
      const nm = m + dir
      if (nm > 11) { setAnio(a => a + 1); return 0 }
      if (nm < 0)  { setAnio(a => a - 1); return 11 }
      return nm
    })
  }

  const filtrados = movimientos.filter(m => {
    if (!m.fecha) return false
    const [y, mo] = m.fecha.split('-')
    return parseInt(mo) - 1 === mes && parseInt(y) === anio
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#1A3C34' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', flexShrink: 0 }}>
        <button onClick={() => cambiarMes(-1)} style={estiloFlecha}>{flechaIzq}</button>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>{nombresMes[mes]} {anio}</span>
        <button onClick={() => cambiarMes(1)} style={estiloFlecha}>{flechaDer}</button>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 12px 12px' }}>
          {filtrados.length === 0
            ? <EmptyState mes={nombresMes[mes]} />
            : items.map((item) =>
                item.tipo === 'separador'
                  ? <SeparadorFecha key={`sep-${item.fecha}`} fecha={item.fecha} />
                  : <MovimientoCard key={item.m.id} m={item.m} onEliminar={onEliminar} onAbrir={setModalMov} />
              )
          }
        </div>
      </div>

      <Modal
        m={modalMov}
        onCerrar={() => setModalMov(null)}
        onMarcarRealizado={onMarcarRealizado}
        onRepetir={onRepetir}
        onEditarClick={(m) => { onEditarClick(m); setModalMov(null); }}
      />
    </div>
  )
}