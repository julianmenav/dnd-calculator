import { useTranslation } from 'react-i18next'
import { useAnalysis } from '../context/AnalysisContext'
import { sectionLabel } from '../lib/ui'

/** More than this and the panel stops being a summary. */
export const CROSSOVER_LIMIT = 6

export default function Crossovers() {
  const { t } = useTranslation()
  const analysis = useAnalysis()

  if (analysis.crossovers.length === 0) return null

  const shown = analysis.crossovers.slice(0, CROSSOVER_LIMIT)
  const hidden = analysis.crossovers.length - shown.length

  return (
    <div className="border-rule bg-panel rounded-panel flex flex-col gap-2 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className={sectionLabel}>{t('analysis.crossovers')}</span>
        <span className="text-ink-4 text-[10px]">
          {t('analysis.crossoversHint')}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
        {shown.map((crossover, index) => (
          <div
            key={`${crossover.characterName}-${crossover.fallsBehind}-${index}`}
            className="border-rule bg-card rounded-field flex items-center gap-3 border p-2.5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-ink text-[11px] leading-snug font-medium">
                {t('analysis.fallsBehind', {
                  loser: crossover.fallsBehind || t('turn.unnamed'),
                  winner: crossover.overtakenBy || t('turn.unnamedLower'),
                })}
              </span>
              <span className="text-ink-3 text-[10px] leading-snug">
                {t('analysis.bothLand', {
                  name: crossover.characterName || t('character.unnamed'),
                  damage: crossover.damage.toFixed(2),
                })}
              </span>
            </div>

            <span className="text-ink ml-auto shrink-0 font-mono text-[12px] font-bold tabular-nums">
              {t('analysis.crossoverAc', { ac: crossover.ac.toFixed(1) })}
            </span>
          </div>
        ))}
      </div>

      {hidden > 0 && (
        <span className="text-ink-4 text-[10px]">
          {t('analysis.moreCrossings', { count: hidden })}
        </span>
      )}
    </div>
  )
}
