import { useTranslation } from 'react-i18next'
import type { Dice } from '../models'
import { DICE_COLORS } from '../models'
import { cn } from '../lib/utils'

const chipClass =
  'rounded-field border px-1.5 py-1 font-mono text-[11px] leading-none font-bold'

export default function DiceSelection({
  dices,
  onDiceClick,
}: {
  dices: Dice[]
  /** When set, chips become buttons — clicking one hands back its die. */
  onDiceClick?: (dice: Dice) => void
}) {
  const { t } = useTranslation()
  const groupedDices = groupDices(dices)

  return (
    <div className="flex flex-wrap gap-1">
      {groupedDices.map(({ dice, count, chip }) =>
        onDiceClick ? (
          <button
            key={dice}
            className={cn(
              chipClass,
              chip,
              'cursor-pointer transition-opacity hover:opacity-60'
            )}
            title={t('attack.removeDie', { dice })}
            onClick={() => onDiceClick(dice)}
          >
            {count}d{dice}
          </button>
        ) : (
          <span key={dice} className={cn(chipClass, chip)}>
            {count}d{dice}
          </span>
        )
      )}
    </div>
  )
}

const groupDices = (dices: Dice[]) => {
  const grouped: Record<Dice, number> = {
    4: 0,
    6: 0,
    8: 0,
    10: 0,
    12: 0,
    20: 0,
  }
  dices.forEach((dice) => {
    grouped[dice] += 1
  })
  return Object.entries(grouped)
    .map(([dice, count]) => ({
      dice: Number(dice) as Dice,
      count,
      chip: DICE_COLORS[Number(dice) as Dice],
    }))
    .filter(({ count }) => count > 0)
}
