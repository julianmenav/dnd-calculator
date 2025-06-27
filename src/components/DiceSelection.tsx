import type { Dice } from '../models'

export default function DiceSelection({ dices }: { dices: Dice[] }) {

  const groupedDices = groupDices(dices);

  return (
    <div>
      {groupedDices.map(({ dice, count }) => {
        return count > 0 && (
          <span key={dice} className="badge bg-primary badge-xs p-2">
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
  }))
}
