import { useTranslation } from 'react-i18next'
import type { TurnBreakdown } from '../lib/calculator'
import { cn } from '../lib/utils'
import { microLabel } from '../lib/ui'

type Source = {
  /** Doubles as the `sources.*` translation key for the legend label. */
  key: keyof Pick<TurnBreakdown, 'dice' | 'crit' | 'ability' | 'bonus' | 'feat'>
  bar: string
  swatch: string
  text: string
}

/**
 * Stack order runs from what every attack has to what only some builds buy,
 * lightening as it goes, so the part a feat is responsible for is the part
 * that stands out.
 */
const SOURCES: Source[] = [
  {
    key: 'dice',
    bar: 'bg-src-dice',
    swatch: 'bg-src-dice',
    text: 'text-ink-2',
  },
  {
    key: 'crit',
    bar: 'bg-src-crit',
    swatch: 'bg-src-crit',
    text: 'text-ink-2',
  },
  {
    key: 'ability',
    bar: 'bg-src-ability',
    swatch: 'bg-src-ability',
    text: 'text-ink-2',
  },
  {
    key: 'bonus',
    bar: 'bg-src-bonus',
    swatch: 'bg-src-bonus',
    text: 'text-ink-2',
  },
  {
    key: 'feat',
    bar: 'bg-src-feat',
    swatch: 'bg-src-feat',
    text: 'text-src-feat',
  },
]

export default function DamageSources({
  breakdown,
}: {
  breakdown: TurnBreakdown
}) {
  const { t } = useTranslation()
  if (breakdown.total <= 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-2 gap-0.5">
        {SOURCES.map((source) => {
          const value = breakdown[source.key]
          if (value <= 0) return null
          return (
            <div
              key={source.key}
              className={cn('rounded-chip', source.bar)}
              style={{ flexGrow: value }}
              title={`${t(`sources.${source.key}`)} ${value.toFixed(2)}`}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-x-1.5 gap-y-1">
        {SOURCES.map((source) => {
          const value = breakdown[source.key]
          const empty = value <= 0
          return (
            <div key={source.key} className="flex items-center gap-1">
              <span
                className={cn(
                  'rounded-chip h-1.5 w-1.5 shrink-0',
                  empty ? 'bg-line' : source.swatch
                )}
              />
              <span
                className={cn(
                  microLabel,
                  'tracking-[0.06em]',
                  empty && 'text-ink-5'
                )}
              >
                {t(`sources.${source.key}`)}
              </span>
              <span
                className={cn(
                  'font-mono text-[9px] leading-none tabular-nums',
                  empty ? 'text-ink-5' : source.text
                )}
              >
                {empty ? '—' : value.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
