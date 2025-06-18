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
      <div className="card card-border bg-base-200 indicator w-full shadow-md">
        <button
          className="indicator-item indicator-start bg-error text-error-content flex w-14 cursor-pointer items-center justify-center rounded-sm px-1 py-0.5 text-xs"
          onClick={() => removeCharacter(character.id)}
        >
          Delete
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
              <label className="input input-xs">
                <span className="label w-1/4">Str</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.abilities.Strength}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      abilities: {
                        ...character.abilities,
                        Strength: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="input input-xs">
                <span className="label w-1/4">Dex</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.abilities.Dexterity}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      abilities: {
                        ...character.abilities,
                        Dexterity: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="input input-xs">
                <span className="label w-1/4">Con</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.abilities.Constitution}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      abilities: {
                        ...character.abilities,
                        Constitution: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="input input-xs">
                <span className="label w-1/4">Int</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.abilities.Intelligence}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      abilities: {
                        ...character.abilities,
                        Intelligence: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="input input-xs">
                <span className="label w-1/4">Wis</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.abilities.Wisdom}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      abilities: {
                        ...character.abilities,
                        Wisdom: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="input input-xs">
                <span className="label w-1/4">Cha</span>
                <input
                  className="input w-3/4"
                  type="text"
                  value={character.abilities.Charisma}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      abilities: {
                        ...character.abilities,
                        Charisma: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
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
