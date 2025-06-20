import { CharacterProvider } from '../context/CharacterContext'
import type { Character } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import TurnComponent from './Turn'
import { ABILITIES } from '../models'
import X from '../icons/X'

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
      <div className="card card-border bg-base-100 indicator w-full shadow-md">
        <button
          className="indicator-item bg-error/40 hover:bg-error/70 text-error-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
          onClick={() => removeCharacter(character.id)}
        >
          <X />
        </button>
        <div className="card-body flex flex-row justify-between gap-3">
          <div className="flex w-58 flex-col gap-1">
            <div className="grid grid-cols-2 gap-1">
              <input
                className="input input-xs"
                placeholder="Character Name"
                value={character.name}
                onChange={(e) =>
                  updateCharacter(character.id, { name: e.target.value })
                }
              />
              <label className="input input-xs">
                <span className="label w-1/4">LvL</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.lvl}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      lvl: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <hr className="my-2" />
            <div className="grid grid-cols-2 gap-1">
              {ABILITIES.map((ability) => (
                <label key={ability} className="input input-xs">
                  <span className="label w-1/4">{ability.slice(0, 3)}</span>
                  <input
                    className="input w-3/4"
                    type="text"
                    value={character.abilities[ability]}
                    onChange={(e) =>
                      updateCharacter(character.id, {
                        abilities: {
                          ...character.abilities,
                          [ability]: Number(e.target.value),
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-grow flex-col">
            <button
              className="btn btn-success btn-xs w-24"
              onClick={() => addTurn(character.id)}
            >
              Add turn
            </button>
            <div className="p-2">
              {character.turns.map((turn) => (
                <TurnComponent key={turn.id} turn={turn} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </CharacterProvider>
  )
}
