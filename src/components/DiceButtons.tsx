import type { Dice } from '../models'
import { DICE_SIDES, DICE_COLORS } from '../models'
import { cn } from '../lib/utils'

/** The clickable d4–d12 row shared by the attack creator and the dice editor. */
export default function DiceButtons({
  onPick,
}: {
  onPick: (dice: Dice) => void
}) {
  return (
    <div className="flex gap-1">
      {DICE_SIDES.filter((dice) => dice !== 20).map((dice) => (
        <button
          key={dice}
          className={cn(
            'rounded-field flex h-8 flex-1 cursor-pointer items-center justify-center border font-mono text-[13px] font-bold transition-opacity hover:opacity-70',
            DICE_COLORS[dice]
          )}
          onClick={() => onPick(dice)}
        >
          d{dice}
        </button>
      ))}
    </div>
  )
}
