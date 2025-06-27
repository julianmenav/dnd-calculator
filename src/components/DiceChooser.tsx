import { useState } from 'react'
import type { Dice } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { DICE_SIDES, DICE_COLORS } from '../models'
import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import Plus from '../icons/Plus'
import DiceSelection from './DiceSelection'
import Confirm from '../icons/Confirm'

export default function DiceChooser() {
  const [showDiceChooser, setShowDiceChooser] = useState(false)
  const [dices, setDices] = useState<Dice[]>([])
  const { addAttack } = useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const turn = useTurn()

  return (
    <>
      {!showDiceChooser ? (
        <button
          className="btn btn-secondary btn-xs w-full"
          onClick={() => setShowDiceChooser(true)}
        >
          <Plus /> Add Attack
        </button>
      ) : (
        <div>
          <div className="flex flex-row gap-0.5 rounded-md bg-black/20 p-1">
            {DICE_SIDES.map((dice) => (
              <button
                key={dice}
                className={`btn btn-xs btn-secondary text-base ${DICE_COLORS[dice].background} ${DICE_COLORS[dice].text} hover:opacity-70`}
                onClick={() => {
                  if (dices.length > 20) return
                  setDices((prev) => {
                    const newDices = [...prev, dice]
                    return newDices
                  })
                }}
              >
                {dice}
              </button>
            ))}
            <button
              className="btn-success btn btn-xs flex cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
              onClick={() => {
                addAttack(character.id, turn.id, dices)
                setDices([])
                setShowDiceChooser(false)
              }}
            >
              <Confirm />
            </button>
          </div>
          <DiceSelection dices={dices} />
        </div>
      )}
    </>
  )
}
