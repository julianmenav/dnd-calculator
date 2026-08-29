import { createContext, useContext } from 'react'
import type { ScenarioAnalysis } from '../lib/analysis'

const AnalysisContext = createContext<ScenarioAnalysis | null>(null)

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}

export const AnalysisProvider = AnalysisContext.Provider
