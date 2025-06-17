import { CharacterProvider } from '../context/CharacterContext'
import type { Character } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import TurnComponent from './Turn'

export default function CharacterComponent({
  character,
}: {
  character: Character
}) {
  const { updateCharacter, removeCharacter, addTurn } = useScenarioStore(
    (state) => state.actions
  )

  return (
    <CharacterProvider value={character}>
      <div className="flex w-full flex-row justify-between gap-3 rounded-md border border-black p-2">
        <div className="flex w-96 flex-col gap-1 border border-white p-3">
          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-sm bg-red-200 px-2 text-red-600 shadow-md"
              onClick={() => removeCharacter(character.id)}
            >
              Delete
            </button>
            <input
              className="flex-grow border border-gray-200 p-1"
              value={character.name}
              onChange={(e) =>
                updateCharacter(character.id, { name: e.target.value })
              }
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <label>LvL</label>
              <input
                className="border border-gray-200 p-1"
                type="number"
                value={character.lvl}
                onChange={(e) =>
                  updateCharacter(character.id, {
                    lvl: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-grow flex-col">
          <button onClick={() => addTurn(character.id)}>Add turn</button>
          {character.turns.map((turn) => (
            <TurnComponent key={turn.id} turn={turn} />
          ))}
        </div>
      </div>
    </CharacterProvider>
  )
}
