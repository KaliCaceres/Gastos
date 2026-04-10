import { useState } from 'react'
import { useTema } from '../TemaContext'

const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function fmt(n) { return '$' + Math.abs(Math.round(n)).toLocaleString('es-AR') }

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

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
  Default: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
}

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

function LabelSeccion({ texto, tema }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: tema.textoSub, textTransform: 'uppercase', padding: '10px 4px 4px' }}>
      {texto}
    </p>
  )
}

export default function Resumen({ movimientos, mes, anio, onCambiarMes }) {
  const { tema } = useTema()
  const [incluirPendientes, setIncluirPendientes] = useState(false)

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

  const movsMes = movimientos.filter(m => {
    if (!m.fecha) return false
    const [y, mo] = m.fecha.split('-')
    return parseInt(mo) - 1 === mes && parseInt(y) === anio
  })

  const realizados = movsMes.filter(m => m.estado === 'realizado')
  const pendientes = movsMes.filter(m => m.estado === 'pendiente')

  const totalEgresos      = realizados.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0)
  const totalIngresos     = realizados.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0)
  const totalEgresosPend  = pendientes.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0)
  const totalIngresosPend = pendientes.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0)
  const cantEgresosPend   = pendientes.filter(m => m.tipo === 'egreso').length
  const cantIngresosPend  = pendientes.filter(m => m.tipo === 'ingreso').length

  const base  = totalIngresos - totalEgresos
  const pend  = totalIngresosPend - totalEgresosPend
  const total = incluirPendientes ? base + pend : base

  const movsFiltrados = incluirPendientes ? movsMes : realizados
  const categorias = {}
  movsFiltrados.forEach(m => {
    if (!categorias[m.categoria]) categorias[m.categoria] = { total: 0, count: 0 }
    categorias[m.categoria].total += m.tipo === 'ingreso' ? m.monto : -m.monto
    categorias[m.categoria].count += 1
  })

  const estiloSolido = (tipo) => tipo === 'egreso'
    ? { background: tema.egreso, boxShadow: `0 4px 0px ${tema.egresoSombra}`, borderTop: '1px solid rgba(255,255,255,0.12)' }
    : { background: tema.ingreso, boxShadow: `0 4px 0px ${tema.ingresoSombra}`, borderTop: '1px solid rgba(255,255,255,0.12)' }

  const estiloGhost = (tipo) => tipo === 'egreso'
    ? { background: `rgba(${hexToRgb(tema.egreso)},0.35)`, border: `1.5px dashed ${tema.bordeDash}` }
    : { background: `rgba(${hexToRgb(tema.ingreso)},0.35)`, border: `1.5px dashed ${tema.bordeDash}` }

  const estiloMedio = (tipo) => tipo === 'egreso'
    ? { background: tema.egresoSombra, borderTop: '1px solid rgba(255,255,255,0.08)' }
    : { background: tema.ingresoSombra, borderTop: '1px solid rgba(255,255,255,0.08)' }

  const colorPendLabel = incluirPendientes ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'
  const colorPendValor = incluirPendientes ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'
  const iconColorPend  = incluirPendientes ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: tema.fondo }}>

      <p style={{ fontSize: 22, fontWeight: 700, color: tema.texto, padding: '4px 4px 0' }}>Resumen</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 4px' }}>
        <button onClick={() => cambiarMes(-1)} style={estiloFlecha}>{flechaIzq}</button>
        <span style={{ fontSize: 17, fontWeight: 600, color: tema.texto }}>{nombresMes[mes]} {anio}</span>
        <button onClick={() => cambiarMes(1)} style={estiloFlecha}>{flechaDer}</button>
      </div>

      <Tarjeta estilo={estiloSolido('egreso')} icono={ICONOS.egreso('rgba(255,255,255,0.8)')} label="Egresos" sub={`${realizados.filter(m => m.tipo === 'egreso').length} realizados`} valor={`-${fmt(totalEgresos)}`} colorLabel="#fff" colorValor="#fff" />

      {cantEgresosPend > 0 && (
        <Tarjeta estilo={incluirPendientes ? estiloMedio('egreso') : estiloGhost('egreso')} icono={ICONOS.egreso(iconColorPend)} label="Egresos pendientes" sub={`${cantEgresosPend} pendiente${cantEgresosPend !== 1 ? 's' : ''}`} valor={`-${fmt(totalEgresosPend)}`} colorLabel={colorPendLabel} colorValor={colorPendValor} />
      )}

      <Tarjeta estilo={estiloSolido('ingreso')} icono={ICONOS.ingreso('rgba(255,255,255,0.8)')} label="Ingresos" sub={`${realizados.filter(m => m.tipo === 'ingreso').length} realizados`} valor={`+${fmt(totalIngresos)}`} colorLabel="#fff" colorValor="#fff" />

      {cantIngresosPend > 0 && (
        <Tarjeta estilo={incluirPendientes ? estiloMedio('ingreso') : estiloGhost('ingreso')} icono={ICONOS.ingreso(iconColorPend)} label="Ingresos pendientes" sub={`${cantIngresosPend} pendiente${cantIngresosPend !== 1 ? 's' : ''}`} valor={`+${fmt(totalIngresosPend)}`} colorLabel={colorPendLabel} colorValor={colorPendValor} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: '14px 16px', background: `rgba(${hexToRgb(tema.acento)},0.15)`, border: `1.5px solid rgba(${hexToRgb(tema.acento)},0.3)` }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {ICONOS.total(tema.acento)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: tema.acento }}>Total</p>
          <p style={{ margin: 0, fontSize: 12, color: tema.textoSub, marginTop: 2 }}>{incluirPendientes ? 'Con pendientes' : 'Sin pendientes'}</p>
        </div>
        <span style={{ fontSize: 17, fontWeight: 600, color: total >= 0 ? tema.acento : '#FF6B6B', flexShrink: 0 }}>
          {total >= 0 ? '+' : '-'}{fmt(total)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: tema.textoSub }}>Incluir pendientes</span>
        <div onClick={() => setIncluirPendientes(!incluirPendientes)} style={{ width: 44, height: 24, borderRadius: 99, cursor: 'pointer', background: incluirPendientes ? tema.acento : tema.superficie, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 3, left: incluirPendientes ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </div>
      </div>

      <LabelSeccion texto="Por categoría" tema={tema} />

      {Object.entries(categorias).map(([cat, data]) => {
        const esPositivo = data.total >= 0
        const tipo = esPositivo ? 'ingreso' : 'egreso'
        const Icono = ICONOS[cat] || ICONOS.Default
        return (
          <Tarjeta key={cat} estilo={estiloSolido(tipo)} icono={Icono('rgba(255,255,255,0.8)')} label={cat} sub={`${data.count} movimiento${data.count !== 1 ? 's' : ''}`} valor={`${esPositivo ? '+' : '-'}${fmt(data.total)}`} colorLabel="#fff" colorValor="#fff" />
        )
      })}
    </div>
  )
}