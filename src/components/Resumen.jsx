import { useState } from 'react'

const iconos = {
  egreso: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  ),
  ingreso: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  total: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  pendiente: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
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
}

const iconoDefault = (color) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
  </svg>
)

function fmt(n) { return '$' + Math.abs(Math.round(n)).toLocaleString('es-AR') }

function Tarjeta({ fondo, icono, label, sub, valor, colorValor, derecha }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: fondo, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icono}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{label}</p>
        {sub && <p style={{ margin: 0, fontSize: 12, color: '#666', marginTop: 2 }}>{sub}</p>}
      </div>
      {derecha || <span style={{ fontSize: 17, fontWeight: 500, color: colorValor, flexShrink: 0 }}>{valor}</span>}
    </div>
  )
}

export default function Resumen({ movimientos }) {
  const [incluirPendientes, setIncluirPendientes] = useState(false)

  const realizados = movimientos.filter(m => m.estado === 'realizado')
  const pendientes = movimientos.filter(m => m.estado === 'pendiente')

  const totalEgresos = realizados.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0)
  const totalIngresos = realizados.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0)
  const totalPendientes = pendientes.reduce((s, m) => m.tipo === 'ingreso' ? s + m.monto : s - m.monto, 0)

  const base = totalIngresos - totalEgresos
  const total = incluirPendientes ? base + totalPendientes : base

  // Agrupar por categoría
  const categorias = {}
  movimientos.forEach(m => {
    if (!categorias[m.categoria]) categorias[m.categoria] = { total: 0, count: 0 }
    categorias[m.categoria].total += m.tipo === 'ingreso' ? m.monto : -m.monto
    categorias[m.categoria].count += 1
  })

  const labelSeccion = (texto) => (
    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: '#999', textTransform: 'uppercase', padding: '12px 4px 6px' }}>
      {texto}
    </p>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>

      {labelSeccion('General')}

      <Tarjeta
        fondo="#FFD6D6" icono={iconos.egreso('#C0392B')}
        label="Egresos" sub={`${realizados.filter(m => m.tipo === 'egreso').length} movimientos`}
        valor={`-${fmt(totalEgresos)}`} colorValor="#C0392B"
      />
      <Tarjeta
        fondo="#D6EDDA" icono={iconos.ingreso('#27AE60')}
        label="Ingresos" sub={`${realizados.filter(m => m.tipo === 'ingreso').length} movimientos`}
        valor={`+${fmt(totalIngresos)}`} colorValor="#27AE60"
      />
      <Tarjeta
        fondo="#E8E4FF" icono={iconos.total('#4B3FC7')}
        label="Total" sub={incluirPendientes ? 'Con pendientes' : 'Sin pendientes'}
        valor={`${total >= 0 ? '+' : '-'}${fmt(total)}`} colorValor={total >= 0 ? '#4B3FC7' : '#C0392B'}
      />

      {/* Pendientes con toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FFF3CD', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {iconos.pendiente('#B7770D')}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Pendientes</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Incluir en el total</span>
            <div onClick={() => setIncluirPendientes(!incluirPendientes)} style={{
              width: 36, height: 20, borderRadius: 99,
              background: incluirPendientes ? '#B7770D' : '#ddd',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: incluirPendientes ? 19 : 3,
                width: 14, height: 14, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s'
              }} />
            </div>
          </div>
        </div>
        <span style={{ fontSize: 17, fontWeight: 500, color: '#B7770D', flexShrink: 0 }}>
          {totalPendientes >= 0 ? '+' : '-'}{fmt(totalPendientes)}
        </span>
      </div>

      {labelSeccion('Por categoría')}

      {Object.entries(categorias).map(([cat, data]) => {
        const esPositivo = data.total >= 0
        const color = esPositivo ? '#27AE60' : '#C0392B'
        const fondo = esPositivo ? '#D6EDDA' : '#FFD6D6'
        const Icono = iconos[cat] || iconoDefault
        return (
          <Tarjeta
            key={cat}
            fondo={fondo} icono={Icono(color)}
            label={cat} sub={`${data.count} movimiento${data.count !== 1 ? 's' : ''}`}
            valor={`${esPositivo ? '+' : '-'}${fmt(data.total)}`} colorValor={color}
          />
        )
      })}

    </div>
  )
}