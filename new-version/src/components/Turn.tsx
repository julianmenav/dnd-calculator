import { useCharacter } from '../context/CharacterContext'
import { useScenario } from '../context/ScenarioContext'
import { TurnProvider } from '../context/TurnContext'
import type { Turn } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import AttackComponent from './Attack'
import DiceChooser from './DiceChooser'

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { updateTurn, removeTurn } = useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const scenario = useScenario()

  return (
    <TurnProvider value={turn}>
      <div className="card indicator card-border bg-base-100 w-full shadow-md">
        <button
          className="indicator-item bg-error text-error-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm px-1 py-0.5 text-xs"
          onClick={() => removeTurn(character.id, turn.id)}
        >
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"></path>{' '}
            </g>
          </svg>
        </button>
        <div className="card-header flex items-center justify-between p-4">
          <input
            className="input input-xs"
            value={turn.name}
            onChange={(e) =>
              updateTurn(character.id, turn.id, { name: e.target.value })
            }
          />
          <DiceChooser />
          <label className="input input-xs">
            <span className="label w-1/4">Enemy Ac</span>
            <input
              className="input w-3/4"
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
        <div className="card-body flex items-center gap-2"></div>

        <div className="flex flex-col gap-2">
          {turn.attacks.map((attack) => (
            <AttackComponent key={attack.id} attack={attack} />
          ))}
        </div>
      </div>
    </TurnProvider>
  )
}
