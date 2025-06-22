import { CharacterProvider } from '../context/CharacterContext'
import type { Character } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import TurnComponent from './Turn'
import { ABILITIES } from '../models'
import X from '../icons/X'
import Plus from '../icons/Plus'
import Squares from '../icons/Squares'

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
        <div
          className={
            'flex min-w-[280px] flex-col justify-between gap-3 p-2' +
            (character.compactMode && 'max-w-[300px]')
          }
        >
          <div className="flex w-full flex-row justify-between gap-1">
            <div className="flex flex-row flex-grow gap-1">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  updateCharacter(character.id, {
                    compactMode: !character.compactMode,
                  })
                }
              >
                <Squares />
              </button>
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
            {!character.compactMode && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => addTurn(character.id)}
              >
                <Plus /> Add turn
              </button>
            )}
          </div>
          {!character.compactMode && (
            <div className="flex max-w-[900px] flex-row flex-wrap justify-around gap-1">
              {ABILITIES.map((ability) => (
                <label key={ability} className="input input-xs max-w-[90px]">
                  <span className="label w-1/12">{ability.slice(0, 3)}</span>
                  <input
                    className="input w-11/12"
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
          )}
          <div
            className={
              'flex flex-grow gap-5' +
              (character.compactMode
                ? ' flex-col items-center justify-center'
                : ' flex-row justify-center')
            }
          >
            {character.turns.map((turn) => (
              <TurnComponent key={turn.id} turn={turn} />
            ))}
          </div>
        </div>
      </div>
    </CharacterProvider>
  )
}
