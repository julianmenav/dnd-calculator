import { useCharacter } from '../context/CharacterContext'
import { useScenario } from '../context/ScenarioContext'
import { TurnProvider } from '../context/TurnContext'
import type { Turn } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import AttackComponent from './Attack'

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { updateTurn } = useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const scenario = useScenario()

  return (
    <TurnProvider value={turn}>
      <div className="w-full bg-green-200">
        <input
          className="text-black"
          type="text"
          value={turn.name}
          onChange={(e) =>
            updateTurn(character.id, turn.id, { name: e.target.value })
          }
        />
        <input
          className="bg-amber-300 text-black"
          type="number"
          value={turn.enemyAc ?? scenario.enemyAc}
          onChange={(e) =>
            updateTurn(character.id, turn.id, {
              enemyAc: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <div className="flex flex-col gap-2">
          {turn.attacks.map((attack) => (
            <AttackComponent key={attack.id} attack={attack} />
          ))}
        </div>
      </div>
    </TurnProvider>
  )
}
