import { useCharacter } from '../context/CharacterContext'
import { useScenario } from '../context/ScenarioContext'
import { TurnProvider } from '../context/TurnContext'
import X from '../icons/X'
import type { Turn } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import AttackComponent from './Attack'
import DiceChooser from './DiceChooser'
import { calculateTurnDamage } from '../lib/calculator'
import { useEffect, useState } from 'react'
import Copy from '../icons/Copy'

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { updateTurn, copyTurn, removeTurn } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const scenario = useScenario()

  const [avgDamage, setAvgDamage] = useState<number>(0)

  useEffect(() => {
    const damage = calculateTurnDamage(turn, character, scenario)
    setAvgDamage(damage)
  }, [turn, character, scenario])

  return (
    <TurnProvider value={turn}>
      <div className="card indicator bg-base-300 w-[280px] p-3 shadow-md">
        {!character.compactMode && (
          <div className="indicator-item indicator-end flex translate-x-0 -translate-y-[50%] gap-1">
            <button
              onClick={() => copyTurn(character.id, turn.id)}
              className="bg-success/40 hover:bg-success/70 text-success-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
            >
              <Copy />
            </button>
            <button
              className="bg-error/40 hover:bg-error/70 text-error-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
              onClick={() => removeTurn(character.id, turn.id)}
            >
              <X />
            </button>
          </div>
        )}
        <div className="flex flex-col items-center justify-start gap-2">
          <input
            className="input input-sm"
            value={turn.name}
            onChange={(e) =>
              updateTurn(character.id, turn.id, { name: e.target.value })
            }
          />
          {/* <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="label">Enemy Ac</span>
            <input
              className="input input-xs bg-secondary text-secondary-content w-24 border-0"
              type="text"
              value={turn.enemyAc ?? scenario.enemyAc}
              onChange={(e) =>
                updateTurn(character.id, turn.id, {
                  enemyAc: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div> */}
        </div>
        <div className="flex flex-col items-center justify-start gap-3">
          <span className="text-primary mt-4 text-xl font-semibold">
            Avg. Damage: {avgDamage.toFixed(2)}
          </span>
          {!character.compactMode && (
            <>
              <DiceChooser />
              <div className="flex flex-grow flex-col justify-start gap-3">
                {turn.attacks.map((attack) => (
                  <AttackComponent key={attack.id} attack={attack} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </TurnProvider>
  )
}
