import { createContext, useContext } from 'react'
import type { Character } from '../models'

const CharacterContext = createContext<Character | null>(null)

export const useCharacter = () => {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
}

export const CharacterProvider = CharacterContext.Provider
