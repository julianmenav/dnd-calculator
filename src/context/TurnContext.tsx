import { createContext, useContext } from 'react'
import type { Turn } from '../models'

const TurnContext = createContext<Turn | null>(null)

export const useTurn = () => {
  const context = useContext(TurnContext)
  if (!context) {
    throw new Error('useTurn must be used within a TurnProvider')
  }
  return context
}

export const TurnProvider = TurnContext.Provider
