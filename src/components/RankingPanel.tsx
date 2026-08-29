import { useAnalysis } from '../context/AnalysisContext'
import { useScenario } from '../context/ScenarioContext'
import { useScenarioStore } from '../store/scenarioStore'
import { buildHex, sectionLabel, turnDash } from '../lib/ui'
import { cn } from '../lib/utils'

export default function RankingPanel() {
  const analysis = useAnalysis()
  const scenario = useScenario()
  const baselineTurnId = useScenarioStore((state) => state.baselineTurnId)

  const baselineTotal = baselineTurnId
    ? analysis.byTurnId[baselineTurnId]?.breakdown.total
    : undefined

  return (
    <div className="border-rule bg-panel rounded-panel flex flex-col gap-2 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className={sectionLabel}>Ranking</span>
        <span className="text-ink-4 font-mono text-[10px]">
          AC {scenario.enemyAc}
          {baselineTotal !== undefined && ' · vs baseline'}
        </span>
      </div>

      <div className="border-rule rounded-field flex flex-col overflow-hidden border">
        {analysis.ranked.map((row, index) => {
          const isBaseline = row.turnId === baselineTurnId
          const difference =
            baselineTotal === undefined
              ? undefined
              : row.breakdown.total - baselineTotal

          return (
            <div
              key={row.turnId}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5',
                index % 2 === 0 ? 'bg-card' : 'bg-panel',
                isBaseline && 'shadow-[inset_2px_0_0_var(--color-ink-2)]'
              )}
            >
              <span
                className={cn(
                  'w-3 shrink-0 font-mono text-[10px] tabular-nums',
                  row.rank === 1 ? 'text-accent font-bold' : 'text-ink-3'
                )}
              >
                {row.rank}
              </span>

              <svg width="18" height="8" className="shrink-0">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke={buildHex(row.characterIndex)}
                  strokeWidth={row.rank === 1 ? 2.6 : 2}
                  strokeDasharray={turnDash(row.turnIndex) || undefined}
                  strokeLinecap="round"
                />
              </svg>

              <span className="text-ink min-w-0 flex-1 truncate text-[11px] font-medium">
                {row.turnName || 'Unnamed turn'}
              </span>

              <span className="text-ink-4 w-16 shrink-0 truncate text-[10px]">
                {row.characterName || 'Unnamed'}
              </span>

              <div className="bg-ground rounded-chip h-1 w-12 shrink-0">
                <div
                  className="rounded-chip h-1"
                  style={{
                    width: `${analysis.best > 0 ? (row.breakdown.total / analysis.best) * 100 : 0}%`,
                    background: buildHex(row.characterIndex),
                  }}
                />
              </div>

              <span className="text-ink w-11 shrink-0 text-right font-mono text-[11px] font-bold tabular-nums">
                {row.breakdown.total.toFixed(2)}
              </span>

              <span className="w-12 shrink-0 text-right font-mono text-[10px] tabular-nums">
                {isBaseline ? (
                  <span className="text-ink-3 tracking-[0.06em]">BASE</span>
                ) : difference === undefined ? (
                  <span className="text-ink-5">—</span>
                ) : (
                  <span
                    className={difference >= 0 ? 'text-gain' : 'text-loss'}
                  >
                    {difference >= 0 ? '+' : '−'}
                    {Math.abs(difference).toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
