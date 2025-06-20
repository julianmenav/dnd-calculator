import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import type { AbilityType, Attack } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { ABILITIES } from '../models'
import { FEATS } from '../models'
import X from '../icons/X'

export default function AttackComponent({ attack }: { attack: Attack }) {
  const { updateAttack, removeAttack } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const turn = useTurn()

  return (
    <div className="card card-bordered bg-base-300 indicator flex h-[150px] w-[300px] flex-row rounded-sm p-2 shadow-sm">
      <button
        className="indicator-item bg-error/40 hover:bg-error/70 text-error-content flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm p-0.5 text-xs"
        onClick={() => removeAttack(character.id, turn.id, attack.id)}
      >
        <X />
      </button>
      <div className="flex w-1/3 flex-row flex-wrap content-start items-start justify-start gap-2 overflow-auto p-2">
        {attack.dices.map((dice, index) => (
          <span className="badge badge-xs badge-primary" key={index}>
            {dice}
          </span>
        ))}
      </div>
      <div className="flex w-2/3 flex-col p-1">
        <div className="flex w-full flex-row items-start justify-between">
          <div>
            <span className="label text-xs">Attack Bonus</span>
            <select className="select select-xs appearance-none" onChange={(e) => {
              const value = e.target.value as AbilityType || undefined
              const partialUpdate: Partial<Attack> = {
                attackBonusAbility: value,
                damageBonusAbility: attack.damageBonusAbility ? attack.damageBonusAbility : value,
              }

              updateAttack(character.id, turn.id, attack.id, partialUpdate)
            }}>
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
            <select className="select select-xs appearance-none" onChange={(e) => {
              updateAttack(character.id, turn.id, attack.id, {
                damageBonusAbility: e.target.value as AbilityType || undefined,
              })
            }}>
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

        <div className="card card-border mt-2 grid h-full w-full grid-cols-2 gap-0.5 overflow-y-auto p-1 shadow-sm">
          {FEATS.map((feat) => {
            const isSelected = attack.feats.includes(feat)
            return (
              <button
                key={feat}
                className={`btn btn-xs ${
                  isSelected ? 'btn-primary' : 'btn-neutral'
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
      </div>
    </div>
  )
}
