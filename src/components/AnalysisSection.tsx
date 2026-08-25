import { useAnalysis } from '../context/AnalysisContext'
import RankingPanel from './RankingPanel'

export default function AnalysisSection() {
  const analysis = useAnalysis()

  if (analysis.turnCount === 0) return null

  return (
    <section className="border-rule bg-chrome/40 flex shrink-0 flex-col gap-3 border-t px-4 py-4">
      <RankingPanel />
    </section>
  )
}
