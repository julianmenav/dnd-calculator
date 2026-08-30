import { useState } from 'react'
import type { Dice } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import Plus from '../icons/Plus'
import DiceButtons from './DiceButtons'
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
          className="border-loss/30 bg-loss/10 text-loss rounded-field hover:bg-loss/20 inline-flex h-6 w-6 cursor-pointer items-center justify-center border p-0 transition-colors"
          title="Cancel"
          onClick={() => {
            setDices([])
            setShowDiceChooser(false)
          }}
        >
          <X />
        </button>
      </div>

      <DiceButtons
        onPick={(dice) => {
          if (dices.length > 20) return
          setDices((prev) => [...prev, dice])
        }}
      />

      {dices.length > 0 && (
        <div className="border-rule flex items-center gap-2 border-t pt-2">
          <span className={microLabel}>Picked</span>
          <DiceSelection
            dices={dices}
            onDiceClick={(dice) =>
              setDices((prev) => {
                const index = prev.indexOf(dice)
                return index === -1 ? prev : prev.filter((_, i) => i !== index)
              })
            }
          />
        </div>
      )}
    </div>
  )
}
