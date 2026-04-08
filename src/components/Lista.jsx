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

function SeparadorFecha({ fecha }) {
  const label = esHoy(fecha) ? `Hoy — ${fmtFecha(fecha)}` : fmtFecha(fecha)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 4px 8px' }}>
      <div style={{ flex: 1, height: 0.5, background: '#ddd' }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 0.5, background: '#ddd' }} />
    </div>
  )
}

function EmptyState({ mes }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 32, textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        boxShadow: '0 4px 0px #e0ddd8, 0 6px 20px rgba(0,0,0,0.06)',
        borderTop: '1px solid rgba(255,255,255,0.9)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      </div>
      <p style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a', marginBottom: 8 }}>
        Sin movimientos en {mes.toLowerCase()}
      </p>
      <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.6 }}>
        Todavía no registraste<br />nada este mes.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 32, color: '#bbb' }}>
        <div style={{ width: 28, height: 1, background: '#ddd' }} />
        <span style={{ fontSize: 12 }}>deslizá para cambiar de mes</span>
        <div style={{ width: 28, height: 1, background: '#ddd' }} />
      </div>
    </div>
  )
}

function MovimientoCard({ m, onEliminar, onAbrir }) {
  const cardRef         = useRef(null)
  const badgeRef        = useRef(null)
  const bgRef           = useRef(null)
  const snappedRef      = useRef(false)
  const draggingRef     = useRef(false)
  const startXRef       = useRef(0)
  const startYRef       = useRef(0)
  const currentXRef     = useRef(0)
  const isHorizontalRef = useRef(null)
  const movedRef        = useRef(false)
  const SNAP = -88

  const color = m.tipo === 'ingreso' ? '#27AE60' : '#C0392B'
  const Icono = catIconos[m.categoria] || catIconos.Default

  const estiloCard = m.tipo === 'egreso'
    ? { background: 'linear-gradient(145deg,#FFE0E0,#FFCACA)', boxShadow: '0 6px 0px #E8A0A0, 0 8px 16px rgba(192,57,43,0.15)', borderTop: '1px solid rgba(255,255,255,0.7)' }
    : { background: 'linear-gradient(145deg,#E0F5E4,#C8EDD0)', boxShadow: '0 6px 0px #8FC99A, 0 8px 16px rgba(39,174,96,0.15)', borderTop: '1px solid rgba(255,255,255,0.7)' }

  function setX(x, animated) {
    const card  = cardRef.current
    const badge = badgeRef.current
    const bg    = bgRef.current
    if (!card) return
    const dur = '0.25s cubic-bezier(0.22,1,0.36,1)'
    card.style.transition  = animated ? `transform ${dur}` : 'none'
    if (badge) badge.style.transition = animated ? `transform ${dur}` : 'none'
    card.style.transform  = x === 0 ? '' : `translateX(${x}px)`
    if (badge) badge.style.transform = x === 0 ? 'translateX(-50%)' : `translateX(calc(-50% + ${x}px))`
    if (bg) bg.style.opacity = x < -20 ? '1' : '0'
  }

  function onStart(x, y) {
    startXRef.current = x
    startYRef.current = y
    draggingRef.current = true
    isHorizontalRef.current = null
    movedRef.current = false
    currentXRef.current = snappedRef.current ? SNAP : 0
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
    const card  = cardRef.current
    const badge = badgeRef.current
    const bg    = bgRef.current
    if (card)  { card.style.transition = 'none'; card.style.transform = `translateX(${nx}px)`; }
    if (badge) { badge.style.transition = 'none'; badge.style.transform = `translateX(calc(-50% + ${nx}px))`; }
    if (bg)    bg.style.opacity = nx < -20 ? '1' : '0'
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
    <div style={{ position: 'relative', paddingBottom: 12, marginBottom: 4, touchAction: 'pan-y' }}>
      <div ref={bgRef} onClick={() => onEliminar(m.id)} style={{
        position: 'absolute', top: 0, right: 0, bottom: 12, width: 80, borderRadius: 14,
        background: 'linear-gradient(145deg,#FF6B6B,#E74C3C)',
        boxShadow: '0 6px 0px #B03A2E, 0 8px 16px rgba(231,76,60,0.25)',
        borderTop: '1px solid rgba(255,255,255,0.25)',
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
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {Icono(color)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{m.categoria}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#666', marginTop: 2 }}>{m.descripcion || '—'}</p>
        </div>
        <span style={{ fontSize: 16, fontWeight: 500, color, flexShrink: 0 }}>
          {m.tipo === 'ingreso' ? '+' : '-'}{fmt(m.monto)}
        </span>
      </div>

      {m.estado === 'pendiente' && (
        <span ref={badgeRef} style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
          padding: '2px 10px', borderRadius: 99,
          background: '#FFF3CD', color: '#B7770D', border: '1px solid #F5D87A',
          whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          pointerEvents: 'none', willChange: 'transform',
        }}>PENDIENTE</span>
      )}
    </div>
  )
}

function Modal({ m, onCerrar }) {
  if (!m) return null
  const color = m.tipo === 'ingreso' ? '#27AE60' : '#C0392B'
  const badgeEstado = m.estado === 'pendiente'
    ? { background: '#FFF3CD', color: '#B7770D', border: '1px solid #F5D87A' }
    : { background: '#D6EDDA', color: '#27AE60' }
  const badgeTipo = m.tipo === 'egreso'
    ? { background: '#FFD6D6', color: '#C0392B' }
    : { background: '#D6EDDA', color: '#27AE60' }

  const filas = [
    { label: 'Tipo',      content: <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, ...badgeTipo }}>{m.tipo.charAt(0).toUpperCase()+m.tipo.slice(1)}</span> },
    { label: 'Monto',     content: <span style={{ fontSize: 14, fontWeight: 500, color }}>{m.tipo==='ingreso'?'+':'-'}{fmt(m.monto)}</span> },
    { label: 'Estado',    content: <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, ...badgeEstado }}>{m.estado.charAt(0).toUpperCase()+m.estado.slice(1)}</span> },
    { label: 'Método',    content: <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{m.metodo}</span> },
    { label: 'Fecha',     content: <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{fmtFecha(m.fecha)}</span> },
    { label: 'Categoría', content: <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{m.categoria}</span> },
  ]

  return (
    <>
      <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 10 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '20px 20px 0 0', padding: '12px 20px 36px', zIndex: 11 }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: '#ddd', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>{m.categoria} — {m.descripcion || '—'}</p>
        {filas.map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < filas.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
            <span style={{ fontSize: 13, color: '#888' }}>{f.label}</span>
            {f.content}
          </div>
        ))}
      </div>
    </>
  )
}

export default function Lista({ movimientos, onEliminar }) {
  const [modalMov, setModalMov] = useState(null)
  const [mes, setMes]           = useState(new Date().getMonth())
  const [anio, setAnio]         = useState(new Date().getFullYear())
  const [slideStyle, setSlideStyle] = useState({})

  const swipeStartX   = useRef(0)
  const swipeDragging = useRef(false)
  const swipeDX       = useRef(0)
  const UMBRAL = 60

  function animarCambio(dir) {
    const salida  = dir > 0 ? '-110%' : '110%'
    const entrada = dir > 0 ? '110%'  : '-110%'
    setSlideStyle({ transform: `translateX(${salida})`, transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)' })
    setMes(m => {
      const nm = m + dir
      if (nm > 11) { setAnio(a => a + 1); return 0 }
      if (nm < 0)  { setAnio(a => a - 1); return 11 }
      return nm
    })
    setTimeout(() => {
      setSlideStyle({ transform: `translateX(${entrada})`, transition: 'none' })
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setSlideStyle({ transform: 'translateX(0)', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' })
      }))
    }, 220)
  }

  function onSwipeStart(x) {
    swipeStartX.current   = x
    swipeDragging.current = true
    swipeDX.current       = 0
  }

  function onSwipeMove(x) {
    if (!swipeDragging.current) return
    swipeDX.current = x - swipeStartX.current
    setSlideStyle({ transform: `translateX(${swipeDX.current * 0.3}px)`, transition: 'none' })
  }

  function onSwipeEnd() {
    if (!swipeDragging.current) return
    swipeDragging.current = false
    if      (swipeDX.current < -UMBRAL) animarCambio(1)
    else if (swipeDX.current >  UMBRAL) animarCambio(-1)
    else setSlideStyle({ transform: 'translateX(0)', transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)' })
  }

  function onSwipeMouseMove(e) { onSwipeMove(e.clientX) }
  function onSwipeMouseUp()    {
    onSwipeEnd()
    window.removeEventListener('mousemove', onSwipeMouseMove)
    window.removeEventListener('mouseup',   onSwipeMouseUp)
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

console.log('movimientos:', movimientos)
console.log('mes:', mes, 'anio:', anio)
console.log('filtrados:', filtrados)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header mes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px', flexShrink: 0 }}>
        <button onClick={() => animarCambio(-1)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', padding: '4px 8px' }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>{nombresMes[mes]} {anio}</span>
        <button onClick={() => animarCambio(1)}  style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', padding: '4px 8px' }}>›</button>
      </div>

      {/* Contenedor swipe */}
<div
  style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
  onTouchStart={e => onSwipeStart(e.touches[0].clientX)}
  onTouchMove={e  => onSwipeMove(e.touches[0].clientX)}
  onTouchEnd={() => onSwipeEnd()}
  onMouseDown={e => {
    onSwipeStart(e.clientX)
    window.addEventListener('mousemove', onSwipeMouseMove)
    window.addEventListener('mouseup',   onSwipeMouseUp)
  }}
>
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 12px 12px', ...slideStyle }}>          {filtrados.length === 0
            ? <EmptyState mes={nombresMes[mes]} />
            : items.map((item) =>
                item.tipo === 'separador'
                  ? <SeparadorFecha key={`sep-${item.fecha}`} fecha={item.fecha} />
                  : <MovimientoCard key={item.m.id} m={item.m} onEliminar={onEliminar} onAbrir={setModalMov} />
              )
          }
        </div>
      </div>

      <Modal m={modalMov} onCerrar={() => setModalMov(null)} />
    </div>
  )
}