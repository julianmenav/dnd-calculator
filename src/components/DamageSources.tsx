import type { TurnBreakdown } from '../lib/calculator'
import { cn } from '../lib/utils'
import { microLabel } from '../lib/ui'

type Source = {
  key: keyof Pick<TurnBreakdown, 'dice' | 'crit' | 'ability' | 'feat'>
  label: string
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
    label: 'Dice',
    bar: 'bg-src-dice',
    swatch: 'bg-src-dice',
    text: 'text-ink-2',
  },
  {
    key: 'crit',
    label: 'Crit',
    bar: 'bg-src-crit',
    swatch: 'bg-src-crit',
    text: 'text-ink-2',
  },
  {
    key: 'ability',
    label: 'Abil',
    bar: 'bg-src-ability',
    swatch: 'bg-src-ability',
    text: 'text-ink-2',
  },
  {
    key: 'feat',
    label: 'Feat',
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
              title={`${source.label} ${value.toFixed(2)}`}
            />
          )
        })}
      </div>

      <div className="flex gap-1">
        {SOURCES.map((source) => {
          const value = breakdown[source.key]
          const empty = value <= 0
          return (
            <div key={source.key} className="flex flex-1 items-center gap-1">
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
                {source.label}
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
