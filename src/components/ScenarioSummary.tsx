import { useTranslation } from 'react-i18next'
import { useAnalysis } from '../context/AnalysisContext'
import { cn } from '../lib/utils'
import { microLabel } from '../lib/ui'

export default function ScenarioSummary() {
  const { t } = useTranslation()
  const analysis = useAnalysis()

  if (analysis.turnCount === 0) return null

  const best = analysis.ranked[0]

  return (
    <div className="border-rule bg-chrome/60 flex h-12 shrink-0 items-center gap-4 border-b px-4">
      <Figure label={t('summary.builds')} value={String(analysis.characterCount)} />
      <Divider />
      <Figure label={t('summary.turns')} value={String(analysis.turnCount)} />
      <Divider />
      <Figure
        label={t('summary.best')}
        value={analysis.best.toFixed(2)}
        note={best.turnName || best.characterName || t('turn.unnamedLower')}
        accent
      />
      <Divider />
      <Figure label={t('summary.spread')} value={analysis.spread.toFixed(2)} />
      <Divider />
      <Figure label={t('summary.median')} value={analysis.median.toFixed(2)} />
    </div>
  )
}

function Divider() {
  return <div className="bg-rule h-6 w-px shrink-0" />
}

function Figure({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note?: string
  accent?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className={microLabel}>{label}</span>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span
          className={cn(
            'font-mono text-[13px] leading-none font-bold tabular-nums',
            accent ? 'text-accent' : 'text-ink'
          )}
        >
          {value}
        </span>
        {note && (
          <span className="text-ink-2 truncate text-[11px] leading-none">
            {note}
          </span>
        )}
      </div>
    </div>
  )
}
