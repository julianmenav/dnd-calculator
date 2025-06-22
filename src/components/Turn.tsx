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
        <div className="card-header flex items-center justify-between p-4">
          <input
            className="input input-xs"
            value={turn.name}
            onChange={(e) =>
              updateTurn(character.id, turn.id, { name: e.target.value })
            }
          />
          <label className="input input-xs">
            <span className="label w-1/4">Enemy Ac</span>
            <input
              className="input w-3/4 bg-secondary text-secondary-content"
              type="text"
              value={turn.enemyAc ?? scenario.enemyAc}
              onChange={(e) =>
                updateTurn(character.id, turn.id, {
                  enemyAc: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </label>
        </div>
        <div className="card-body flex items-center gap-2">
          <p className="text-accent text-xl font-normal">Avg. Damage: {avgDamage.toFixed(2)}</p>
              
          <div className="flex flex-col gap-3">
            {turn.attacks.map((attack) => (
              <AttackComponent key={attack.id} attack={attack} />
            ))}
          </div>
          <DiceChooser />
        </div>

      </div>
    </TurnProvider>
  )
}
