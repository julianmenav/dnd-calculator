import { cn } from '../lib/utils'

/**
 * Difference against the pinned baseline. The sign carries the meaning on its
 * own — the arrow and colour only reinforce it — so it stays readable without
 * colour vision.
 */
export default function Delta({
  value,
  baseline,
  className,
}: {
  value: number
  baseline: number
  className?: string
}) {
  const difference = value - baseline
  const percent = baseline > 0 ? (difference / baseline) * 100 : 0
  const up = difference >= 0

  return (
    <span
      className={cn(
        'rounded-field flex shrink-0 items-center gap-1 border px-1.5 py-1',
        up
          ? 'border-gain/30 bg-gain/10 text-gain'
          : 'border-loss/30 bg-loss/10 text-loss',
        className
      )}
    >
      <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor">
        {up ? <path d="M4 0.6 7.4 7H0.6z" /> : <path d="M4 7.4 0.6 1h6.8z" />}
      </svg>
      <span className="font-mono text-[10px] leading-none font-medium tabular-nums">
        {up ? '+' : '−'}
        {Math.abs(difference).toFixed(2)}
      </span>
      <span className="font-mono text-[10px] leading-none tabular-nums opacity-70">
        {up ? '+' : '−'}
        {Math.abs(percent).toFixed(1)}%
      </span>
    </span>
  )
}
