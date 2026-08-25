import { useState } from 'react'
import type { Dice } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { DICE_SIDES, DICE_COLORS } from '../models'
import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import Plus from '../icons/Plus'
import DiceSelection from './DiceSelection'
import Confirm from '../icons/Confirm'
import X from '../icons/X'
import { cn } from '../lib/utils'
import { btnDashed, microLabel } from '../lib/ui'

export default function DiceChooser() {
  const [showDiceChooser, setShowDiceChooser] = useState(false)
  const [dices, setDices] = useState<Dice[]>([])
  const { addAttack } = useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const turn = useTurn()

  if (!showDiceChooser) {
    return (
      <button
        className={cn(btnDashed, 'w-full')}
        onClick={() => setShowDiceChooser(true)}
      >
        <Plus />
        Add attack
      </button>
    )
  }

  return (
    <div className="border-accent bg-panel rounded-field flex w-full flex-col gap-2 border p-2">
      <div className="flex items-center gap-2">
        <span className={microLabel}>New attack</span>
        <div className="bg-rule ml-auto h-px flex-grow" />
        <button
          className="bg-gain text-accent-ink rounded-field inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0 p-0 transition-opacity hover:opacity-85"
          title="Add attack"
          onClick={() => {
            addAttack(character.id, turn.id, dices)
            setDices([])
            setShowDiceChooser(false)
          }}
        >
          <Confirm />
        </button>
        <button
          className="border-loss/30 bg-loss/10 text-loss rounded-field inline-flex h-6 w-6 cursor-pointer items-center justify-center border p-0 transition-colors hover:bg-loss/20"
          title="Cancel"
          onClick={() => {
            setDices([])
            setShowDiceChooser(false)
          }}
        >
          <X />
        </button>
      </div>

      <div className="flex gap-1">
        {DICE_SIDES.filter((dice) => dice !== 20).map((dice) => (
          <button
            key={dice}
            className={cn(
              'rounded-field flex h-8 flex-1 cursor-pointer items-center justify-center border font-mono text-[13px] font-bold transition-opacity hover:opacity-70',
              DICE_COLORS[dice]
            )}
            onClick={() => {
              if (dices.length > 20) return
              setDices((prev) => [...prev, dice])
            }}
          >
            d{dice}
          </button>
        ))}
      </div>

      {dices.length > 0 && (
        <div className="border-rule flex items-center gap-2 border-t pt-2">
          <span className={microLabel}>Picked</span>
          <DiceSelection dices={dices} />
        </div>
      )}
    </div>
  )
}
