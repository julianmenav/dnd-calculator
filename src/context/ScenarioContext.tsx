import { createContext, useContext } from 'react'
import type { Scenario } from '../models'

const ScenarioContext = createContext<Scenario | null>(null)

export const useScenario = () => {
  const context = useContext(ScenarioContext)
  if (!context) {
    throw new Error('useCharacter must be used within a ScenarioProvider')
  }
  return context
}

export const ScenarioProvider = ScenarioContext.Provider
