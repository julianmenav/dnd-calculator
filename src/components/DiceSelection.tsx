import type { Dice } from '../models'
import { DICE_COLORS } from '../models'

export default function DiceSelection({ dices }: { dices: Dice[] }) {

  const groupedDices = groupDices(dices);

  return (
    <div className="flex gap-0.5">
      {groupedDices.map(({ dice, count, bgColor, textColor }) => {
        return count > 0 && (
          <span key={dice} className={`badge font-bold p-1 ${bgColor} ${textColor}`}>
            {count}d{dice}
          </span>
        )
      })}
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
  return Object.entries(grouped).map(([dice, count]) => ({
    dice: Number(dice),
    count,
    bgColor: DICE_COLORS[Number(dice) as Dice].background,
    textColor: DICE_COLORS[Number(dice) as Dice].text,
  }))
}
