import { createContext, useContext, useState, useEffect } from 'react'
import { TEMAS, TEMA_DEFAULT } from './tema'

const TemaContext = createContext(null)

export function TemaProvider({ children }) {
  const [temaKey, setTemaKey] = useState(() => localStorage.getItem('tema') || TEMA_DEFAULT)

  useEffect(() => { localStorage.setItem('tema', temaKey) }, [temaKey])

  const tema = TEMAS[temaKey]

  return (
    <TemaContext.Provider value={{ tema, temaKey, setTemaKey }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() { return useContext(TemaContext) }