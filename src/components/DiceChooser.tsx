import { useState } from 'react'
import type { Dice } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { DICE_SIDES } from '../models'
import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import Plus from '../icons/Plus'

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
          className="btn btn-success btn-xs w-full"
          onClick={() => setShowDiceChooser(true)}
        >
          <Plus /> Add Attack
        </button>
      ) : (
        <div>
          <div>
            {DICE_SIDES.map((dice) => (
              <button
                key={dice}
                className="btn btn-xs btn-primary m-1"
                onClick={() => {
                  if (dices.length > 10) return
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
              className="btn btn-success btn-xs m-1"
              onClick={() => {
                addAttack(character.id, turn.id, dices)
                setDices([])
                setShowDiceChooser(false)
              }}
            >
              Confirm
            </button>
          </div>
          <div>
            {dices.map((dice, index) => {
              return (
                <span key={index} className="badge bg-base-300 badge-xs m-1">
                  d{dice}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
