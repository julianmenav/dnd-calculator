import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import type { AbilityType, Attack } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { ABILITIES } from '../models'
import { FEATS, FEAT_EFFECTS } from '../models'
import X from '../icons/X'
import Chevron from '../icons/Chevron'
import { useState } from 'react'
import DiceSelection from './DiceSelection'
import type { AttackBreakdown } from '../lib/calculator'
import { cn } from '../lib/utils'
import { iconBtnDangerSm, microLabel, selectField } from '../lib/ui'

export default function AttackComponent({
  attack,
  breakdown,
}: {
  attack: Attack
  breakdown: AttackBreakdown
}) {
  const { updateAttack, removeAttack } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const turn = useTurn()

  const [showFeats, setShowFeats] = useState(false)

  return (
    <div className="border-rule bg-panel rounded-field flex flex-col gap-2 border p-2">
      <div className="flex items-start gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={microLabel}>Attack bonus</span>
          <div className="relative">
            <select
              className={selectField}
              value={attack.attackBonusAbility ?? ''}
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
              {ABILITIES.map((ability) => (
                <option key={ability} value={ability}>
                  {ability}
                </option>
              ))}
            </select>
            <Chevron className="text-ink-3 pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2" />
          </div>
        </label>

        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={microLabel}>Damage bonus</span>
          <div className="relative">
            <select
              className={selectField}
              value={attack.damageBonusAbility ?? ''}
              onChange={(e) => {
                updateAttack(character.id, turn.id, attack.id, {
                  damageBonusAbility:
                    (e.target.value as AbilityType) || undefined,
                })
              }}
            >
              <option value="">None</option>
              {ABILITIES.map((ability) => (
                <option key={ability} value={ability}>
                  {ability}
                </option>
              ))}
            </select>
            <Chevron className="text-ink-3 pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2" />
          </div>
        </label>

        <button
          className={cn(iconBtnDangerSm, 'mt-[13px]')}
          title="Remove attack"
          onClick={() => removeAttack(character.id, turn.id, attack.id)}
        >
          <X />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <button
          className={cn(
            'rounded-field flex h-7 w-full cursor-pointer items-center justify-center gap-1.5 border text-[11px] font-medium transition-colors',
            showFeats
              ? 'border-ink-4 bg-raised text-ink'
              : 'border-edge bg-raised text-ink-2 hover:border-ink-4 hover:text-ink'
          )}
          onClick={() => setShowFeats((prev) => !prev)}
        >
          Feats
          {attack.feats.length > 0 && (
            <span className="bg-accent text-accent-ink inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px] font-bold">
              {attack.feats.length}
            </span>
          )}
          <Chevron
            className={cn('h-3 w-3 transition-transform', showFeats && 'rotate-180')}
          />
        </button>

        {showFeats && (
          <div className="border-rule bg-card rounded-field grid grid-cols-2 gap-1 border p-1">
            {FEATS.map((feat) => {
              const isSelected = attack.feats.includes(feat)
              return (
                <button
                  key={feat}
                  className={cn(
                    'rounded-chip flex cursor-pointer flex-col items-start gap-1 border px-1.5 py-1.5 transition-colors',
                    isSelected
                      ? 'border-accent bg-accent/12 text-accent'
                      : 'border-edge bg-raised text-ink-2 hover:border-ink-4 hover:text-ink'
                  )}
                  onClick={() => {
                    updateAttack(character.id, turn.id, attack.id, {
                      feats: isSelected
                        ? attack.feats.filter((f) => f !== feat)
                        : [...attack.feats, feat],
                    })
                  }}
                >
                  <span className="text-[10px] leading-none font-medium">
                    {feat}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[8px] leading-none',
                      isSelected ? 'text-accent/70' : 'text-ink-4'
                    )}
                  >
                    {FEAT_EFFECTS[feat]}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DiceSelection dices={attack.dices} />
        <span className="text-ink-3 ml-auto shrink-0 font-mono text-[9px] leading-none tabular-nums">
          hit {(breakdown.hitChance * 100).toFixed(1)}%
        </span>
        <span className="text-ink shrink-0 font-mono text-[13px] leading-none font-bold tabular-nums">
          {breakdown.total.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
