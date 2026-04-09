import { useState } from 'react'

const ICONOS = {
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
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
}

function fmt(n) { return '$' + Math.abs(Math.round(n)).toLocaleString('es-AR') }

const estiloSolido = (tipo) => tipo === 'egreso'
  ? { background: '#B91C1C', boxShadow: '0 4px 0px #7F1D1D', borderTop: '1px solid rgba(255,255,255,0.12)' }
  : { background: '#15803D', boxShadow: '0 4px 0px #14532D', borderTop: '1px solid rgba(255,255,255,0.12)' }

const estiloGhost = (tipo) => tipo === 'egreso'
  ? { background: 'rgba(185,28,28,0.35)', border: '1.5px dashed rgba(255,255,255,0.2)' }
  : { background: 'rgba(21,128,61,0.35)', border: '1.5px dashed rgba(255,255,255,0.2)' }

const estiloMedio = (tipo) => tipo === 'egreso'
  ? { background: '#7F1D1D', borderTop: '1px solid rgba(255,255,255,0.08)' }
  : { background: '#14532D', borderTop: '1px solid rgba(255,255,255,0.08)' }

function Tarjeta({ estilo, icono, label, sub, valor, colorLabel, colorValor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: '14px 16px', transition: 'all 0.3s', ...estilo }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icono}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: colorLabel }}>{label}</p>
        {sub && <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{sub}</p>}
      </div>
      <span style={{ fontSize: 17, fontWeight: 600, color: colorValor, flexShrink: 0 }}>{valor}</span>
    </div>
  )
}

function LabelSeccion({ texto }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', padding: '10px 4px 4px' }}>
      {texto}
    </p>
  )
}

export default function Resumen({ movimientos }) {
  const [incluirPendientes, setIncluirPendientes] = useState(false)

  const realizados = movimientos.filter(m => m.estado === 'realizado')
  const pendientes = movimientos.filter(m => m.estado === 'pendiente')

  const totalEgresos         = realizados.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0)
  const totalIngresos        = realizados.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0)
  const totalEgresosPend     = pendientes.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0)
  const totalIngresosPend    = pendientes.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0)
  const cantEgresosPend      = pendientes.filter(m => m.tipo === 'egreso').length
  const cantIngresosPend     = pendientes.filter(m => m.tipo === 'ingreso').length

  const base  = totalIngresos - totalEgresos
  const pend  = totalIngresosPend - totalEgresosPend
  const total = incluirPendientes ? base + pend : base

  // Categorías — solo realizados, o todos si incluye pendientes
  const movsFiltrados = incluirPendientes ? movimientos : realizados
  const categorias = {}
  movsFiltrados.forEach(m => {
    if (!categorias[m.categoria]) categorias[m.categoria] = { total: 0, count: 0 }
    categorias[m.categoria].total += m.tipo === 'ingreso' ? m.monto : -m.monto
    categorias[m.categoria].count += 1
  })

  // Colores según estado del toggle
  const colorPendLabel = incluirPendientes ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'
  const colorPendValor = incluirPendientes ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'
  const iconColorPend  = incluirPendientes ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: '#1A3C34' }}>

      {/* Egresos realizados */}
      <Tarjeta
        estilo={estiloSolido('egreso')}
        icono={ICONOS.egreso('rgba(255,255,255,0.8)')}
        label="Egresos"
        sub={`${realizados.filter(m => m.tipo === 'egreso').length} realizados`}
        valor={`-${fmt(totalEgresos)}`}
        colorLabel="#fff" colorValor="#fff"
      />

      {/* Egresos pendientes */}
      {cantEgresosPend > 0 && (
        <Tarjeta
          estilo={incluirPendientes ? estiloMedio('egreso') : estiloGhost('egreso')}
          icono={ICONOS.egreso(iconColorPend)}
          label="Egresos pendientes"
          sub={`${cantEgresosPend} pendiente${cantEgresosPend !== 1 ? 's' : ''}`}
          valor={`-${fmt(totalEgresosPend)}`}
          colorLabel={colorPendLabel} colorValor={colorPendValor}
        />
      )}

      {/* Ingresos realizados */}
      <Tarjeta
        estilo={estiloSolido('ingreso')}
        icono={ICONOS.ingreso('rgba(255,255,255,0.8)')}
        label="Ingresos"
        sub={`${realizados.filter(m => m.tipo === 'ingreso').length} realizados`}
        valor={`+${fmt(totalIngresos)}`}
        colorLabel="#fff" colorValor="#fff"
      />

      {/* Ingresos pendientes */}
      {cantIngresosPend > 0 && (
        <Tarjeta
          estilo={incluirPendientes ? estiloMedio('ingreso') : estiloGhost('ingreso')}
          icono={ICONOS.ingreso(iconColorPend)}
          label="Ingresos pendientes"
          sub={`${cantIngresosPend} pendiente${cantIngresosPend !== 1 ? 's' : ''}`}
          valor={`+${fmt(totalIngresosPend)}`}
          colorLabel={colorPendLabel} colorValor={colorPendValor}
        />
      )}

      {/* Total */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: '14px 16px', background: 'rgba(170,235,78,0.15)', border: '1.5px solid rgba(170,235,78,0.3)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {ICONOS.total('#AAEB4E')}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#AAEB4E' }}>Total</p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {incluirPendientes ? 'Con pendientes' : 'Sin pendientes'}
          </p>
        </div>
        <span style={{ fontSize: 17, fontWeight: 600, color: total >= 0 ? '#AAEB4E' : '#FF6B6B', flexShrink: 0 }}>
          {total >= 0 ? '+' : '-'}{fmt(total)}
        </span>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>Incluir pendientes</span>
        <div
          onClick={() => setIncluirPendientes(!incluirPendientes)}
          style={{
            width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
            background: incluirPendientes ? '#AAEB4E' : 'rgba(255,255,255,0.15)',
            position: 'relative', transition: 'background 0.2s', flexShrink: 0
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: incluirPendientes ? 23 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s'
          }} />
        </div>
      </div>

      {/* Por categoría */}
      <LabelSeccion texto="Por categoría" />

      {Object.entries(categorias).map(([cat, data]) => {
        const esPositivo = data.total >= 0
        const tipo = esPositivo ? 'ingreso' : 'egreso'
        const Icono = ICONOS[cat] || ICONOS.Default
        return (
          <Tarjeta
            key={cat}
            estilo={estiloSolido(tipo)}
            icono={Icono('rgba(255,255,255,0.8)')}
            label={cat}
            sub={`${data.count} movimiento${data.count !== 1 ? 's' : ''}`}
            valor={`${esPositivo ? '+' : '-'}${fmt(data.total)}`}
            colorLabel="#fff" colorValor="#fff"
          />
        )
      })}

    </div>
  )
}