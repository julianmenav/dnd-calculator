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

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { updateTurn, removeTurn } = useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const scenario = useScenario()

  const [avgDamage, setAvgDamage] = useState<number>(0)

  useEffect(() => {
    const damage = calculateTurnDamage(turn, character, scenario)
    setAvgDamage(damage)
  }, [turn, character, scenario])

  return (
    <TurnProvider value={turn}>
      <div className="card indicator bg-base-300 w-full p-3 shadow-md">
        <button
          className="indicator-item bg-error/40 hover:bg-error/70 text-error-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
          onClick={() => removeTurn(character.id, turn.id)}
        >
          <X />
        </button>
        <div className="card-header gap-2 flex flex-col justify-start items-center p-4">
          <input
            className="input input-sm"
            value={turn.name}
            onChange={(e) =>
              updateTurn(character.id, turn.id, { name: e.target.value })
            }
          />
          <div className="w-full flex flex-row  items-center justify-between gap-2">
            <span className="label">Enemy Ac</span>
            <input
              className="input input-sm border-0 bg-secondary text-secondary-content w-24"
              type="text"
              value={turn.enemyAc ?? scenario.enemyAc}
              onChange={(e) =>
                updateTurn(character.id, turn.id, {
                  enemyAc: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />

          </div>
        </div>
        <div className=" flex flex-col items-center justify-start gap-3">
          <span className="text-accent text-xl font-normal">
            Avg. Damage: {avgDamage.toFixed(2)}
          </span>

            <DiceChooser />
          <div className="flex flex-grow flex-col justify-start gap-3">
            {turn.attacks.map((attack) => (
              <AttackComponent key={attack.id} attack={attack} />
            ))}
          </div>
        </div>
      </div>
    </TurnProvider>
  )
}
