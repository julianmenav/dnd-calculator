import { CharacterProvider } from '../context/CharacterContext'
import type { Character } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import TurnComponent from './Turn'
import { ABILITIES } from '../models'
import X from '../icons/X'
import Plus from '../icons/Plus'
import Squares from '../icons/Squares'
import InputNumber from './InputNumber'
import Copy from '../icons/Copy'

export default function CharacterComponent({
  character,
}: {
  character: Character
}) {
  const { updateCharacter, copyCharacter, removeCharacter, addTurn } = useScenarioStore(
    (state) => state.actions
  )

  return (
    <CharacterProvider value={character}>
      <div className="card card-border bg-base-100 indicator p-3 shadow-md">
        <div className="indicator-item flex gap-1 indicator-end translate-x-0 -translate-y-[50%]">
          <button className="bg-success/40 hover:bg-success/70 text-success-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
            onClick={() => copyCharacter(character.id)}
          >
            <Copy />
          </button>
          <button
            className="bg-error/40 hover:bg-error/70 text-error-content flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1 text-xs"
            onClick={() => removeCharacter(character.id)}
          >
            <X />
          </button>
        </div>
        <div
          className={
            'flex min-w-[280px] flex-col justify-between gap-3 p-2' +
            (character.compactMode && 'max-w-[300px]')
          }
        >
          <div className="flex w-full flex-row justify-between gap-1">
            <div className="flex flex-grow flex-row gap-1">
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
              <label className="input input-sm max-w-[95px] px-1">
                <span className="label w-1/4 p-0 m-0">LvL</span>
                <InputNumber
                  value={character.lvl}
                  className="input input-sm w-3/4 px-1"
                  onChange={(value) =>
                    updateCharacter(character.id, {
                      lvl: value ?? 0,
                    })
                  }
                  regex={/^$|^\d{1,2}$/}
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
                <label key={ability} className="input input-xs max-w-[90px] px-1">
                  <span className="label w-1/2 p-0 m-0">{ability.slice(0, 3)}</span>
                  <InputNumber
                    value={character.abilities[ability]}
                    className="w-1/2 px-1"
                    regex={/^$|^-?$|^-?[0-9]$/}
                    onChange={(value) => {
                      updateCharacter(character.id, {
                        abilities: {
                          ...character.abilities,
                          [ability]: value,
                        },
                      })
                    }}
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
