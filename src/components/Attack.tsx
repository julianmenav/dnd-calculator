import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import type { AbilityType, Attack } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { ABILITIES } from '../models'
import { FEATS } from '../models'
import X from '../icons/X'
import { useState } from 'react'
import DiceSelection from './DiceSelection'

export default function AttackComponent({ attack }: { attack: Attack }) {
  const { updateAttack, removeAttack } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const turn = useTurn()

  const [showFeats, setShowFeats] = useState(false)

  return (
    <div className="card bg-neutral indicator flex max-h-[230px] max-w-[250px] flex-row rounded-sm p-2 shadow-sm">
      <button
        className="indicator-item bg-error/40 hover:bg-error/70 text-error-content flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm p-0.5 text-xs"
        onClick={() => removeAttack(character.id, turn.id, attack.id)}
      >
        <X />
      </button>
      <div className="flex flex-col p-1">
        <div className="flex w-full flex-row items-start justify-between">
          <div>
            <span className="label text-xs">Attack Bonus</span>
            <select
              className="select select-xs appearance-none"
              onChange={(e) => {
                const value = (e.target.value as AbilityType) || undefined
                const partialUpdate: Partial<Attack> = {
                  attackBonusAbility: value,
                  damageBonusAbility: attack.damageBonusAbility
                    ? attack.damageBonusAbility
                    : value,
                }

                updateAttack(character.id, turn.id, attack.id, partialUpdate)
              }}
            >
              <option value="">None</option>
              {ABILITIES.map((ability) => {
                return (
                  <option
                    key={ability}
                    value={ability}
                    selected={attack.attackBonusAbility === ability}
                  >
                    {ability}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <span className="label text-xs">Damage Bonus</span>
            <select
              className="select select-xs appearance-none"
              onChange={(e) => {
                updateAttack(character.id, turn.id, attack.id, {
                  damageBonusAbility:
                    (e.target.value as AbilityType) || undefined,
                })
              }}
            >
              <option value="">None</option>
              {ABILITIES.map((ability) => {
                return (
                  <option
                    key={ability}
                    value={ability}
                    selected={attack.damageBonusAbility === ability}
                  >
                    {ability}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div>
          <button
            className="btn btn-sm mb-1 w-full"
            onClick={() => setShowFeats((prev) => !prev)}
          >
            Feats{' '}
            {attack.feats.length > 0 && (
              <span className="badge badge-xs badge-primary">
                {attack.feats.length}
              </span>
            )}
          </button>

          {showFeats && (
            <div className="card card-border grid grid-cols-2 gap-0.5 overflow-y-auto p-1 shadow-sm">
              {FEATS.map((feat) => {
                const isSelected = attack.feats.includes(feat)
                return (
                  <button
                    key={feat}
                    className={`btn btn-xs ${
                      isSelected ? 'btn-primary' : 'btn-secondary'
                    }`}
                    onClick={() => {
                      updateAttack(character.id, turn.id, attack.id, {
                        feats: isSelected
                          ? attack.feats.filter((f) => f !== feat)
                          : [...attack.feats, feat],
                      })
                    }}
                  >
                    {feat}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <DiceSelection dices={attack.dices} />
      </div>
    </div>
  )
}
