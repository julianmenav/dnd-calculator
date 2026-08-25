import { useAnalysis } from '../context/AnalysisContext'
import DprCurve from './DprCurve'
import RankingPanel from './RankingPanel'
import Crossovers from './Crossovers'

export default function AnalysisSection() {
  const analysis = useAnalysis()

  if (analysis.turnCount === 0) return null

  return (
    <section className="border-rule bg-chrome/40 flex shrink-0 flex-col gap-3 border-t px-4 py-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-[420px] flex-[2]">
          <DprCurve />
        </div>
        <div className="min-w-[380px] flex-1">
          <RankingPanel />
        </div>
      </div>

      <Crossovers />
    </section>
  )
}
