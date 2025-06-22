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
      <div className="card card-border bg-base-100 indicator p-3 shadow-md">
        <button
          className="indicator-item bg-error/40 hover:bg-error/70 text-error-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
          onClick={() => removeCharacter(character.id)}
        >
          <X />
        </button>
        <div className="flex flex-col justify-between gap-3 p-2">
          <div className="flex w-full flex-row justify-between gap-1">
            <div className="flex flex-row gap-1">
              <input
                className="input input-sm flew-grow"
                placeholder="Character Name"
                value={character.name}
                onChange={(e) =>
                  updateCharacter(character.id, { name: e.target.value })
                }
              />
              <label className="input input-sm max-w-[95px]">
                <span className="label w-1/4">LvL</span>
                <input
                  className="input input-sm w-3/4"
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

            <button
              className="btn btn-success btn-sm"
              onClick={() => addTurn(character.id)}
            >
              Add turn
            </button>
          </div>
          <div className="gap-1 flex flex-row flex-wrap justify-around max-w-[900px]">
            {ABILITIES.map((ability) => (
              <label key={ability} className="input input-xs max-w-[130px]">
                <span className="label w-1/6">{ability.slice(0, 3)}</span>
                <input
                  className="input w-5/6"
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
          <div className="flex flex-grow flex-row gap-5">
            {character.turns.map((turn) => (
              <TurnComponent key={turn.id} turn={turn} />
            ))}
          </div>
        </div>
      </div>
    </CharacterProvider>
  )
}
