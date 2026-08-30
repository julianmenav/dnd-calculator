import { useTranslation } from 'react-i18next'
import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import type { AbilityType, Attack, Dice } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { ABILITIES } from '../models'
import { FEATS } from '../models'
import X from '../icons/X'
import Chevron from '../icons/Chevron'
import Confirm from '../icons/Confirm'
import Copy from '../icons/Copy'
import { useState } from 'react'
import DiceButtons from './DiceButtons'
import DiceSelection from './DiceSelection'
import type { AttackBreakdown } from '../lib/calculator'
import InputNumber from './InputNumber'
import { cn } from '../lib/utils'
import { iconBtnDangerSm, iconBtnSm, microLabel, selectField } from '../lib/ui'

export default function AttackComponent({
  attack,
  breakdown,
}: {
  attack: Attack
  breakdown: AttackBreakdown
}) {
  const { t } = useTranslation()
  const { updateAttack, removeAttack, copyAttack } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const turn = useTurn()

  const [showFeats, setShowFeats] = useState(false)
  const [editDices, setEditDices] = useState(false)

  const update = (partial: Partial<Attack>) =>
    updateAttack(character.id, turn.id, attack.id, partial)

  const addDie = (dice: Dice) => {
    if (attack.dices.length > 20) return
    update({ dices: [...attack.dices, dice] })
  }

  const removeDie = (dice: Dice) => {
    const index = attack.dices.indexOf(dice)
    if (index === -1) return
    update({ dices: attack.dices.filter((_, i) => i !== index) })
  }

  return (
    <div className="border-rule bg-panel rounded-field flex flex-col gap-2 border p-2">
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <BonusRow
            label={t('attack.attack')}
            ability={attack.attackBonusAbility}
            onAbilityChange={(value) => {
              /* A weapon is almost always swung with the stat it is aimed
                 with, so the damage ability follows until it is set apart. */
              update({
                attackBonusAbility: value,
                damageBonusAbility: attack.damageBonusAbility ?? value,
              })
            }}
            flat={attack.attackBonusFlat ?? 0}
            onFlatChange={(value) => update({ attackBonusFlat: value ?? 0 })}
            flatTitle={t('attack.attackFlatTitle')}
          />

          <BonusRow
            label={t('attack.damage')}
            ability={attack.damageBonusAbility}
            onAbilityChange={(value) => update({ damageBonusAbility: value })}
            flat={attack.damageBonusFlat ?? 0}
            onFlatChange={(value) => update({ damageBonusFlat: value ?? 0 })}
            flatTitle={t('attack.damageFlatTitle')}
          />
        </div>

        <div className="mt-[3px] flex flex-col gap-1">
          <button
            className={iconBtnDangerSm}
            title={t('attack.remove')}
            onClick={() => removeAttack(character.id, turn.id, attack.id)}
          >
            <X />
          </button>
          <button
            className={iconBtnSm}
            title={t('attack.duplicate')}
            onClick={() => copyAttack(character.id, turn.id, attack.id)}
          >
            <Copy />
          </button>
        </div>
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
          {t('attack.feats')}
          {attack.feats.length > 0 && (
            <span className="bg-accent text-accent-ink inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px] font-bold">
              {attack.feats.length}
            </span>
          )}
          <Chevron
            className={cn(
              'h-3 w-3 transition-transform',
              showFeats && 'rotate-180'
            )}
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
                    update({
                      feats: isSelected
                        ? attack.feats.filter((f) => f !== feat)
                        : [...attack.feats, feat],
                    })
                  }}
                >
                  <span className="text-[10px] leading-none font-medium">
                    {t(`feats.${feat}`)}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[8px] leading-none',
                      isSelected ? 'text-accent/70' : 'text-ink-4'
                    )}
                  >
                    {t(`featEffects.${feat}`)}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {editDices ? (
        <div className="border-accent bg-card rounded-field flex flex-col gap-2 border p-2">
          <div className="flex items-center gap-2">
            <span className={microLabel}>{t('attack.editDice')}</span>
            <div className="bg-rule ml-auto h-px flex-grow" />
            <button
              className="bg-gain text-accent-ink rounded-field inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0 p-0 transition-opacity hover:opacity-85"
              title={t('attack.done')}
              onClick={() => setEditDices(false)}
            >
              <Confirm />
            </button>
          </div>

          <DiceButtons onPick={addDie} />

          <div className="border-rule flex items-center gap-2 border-t pt-2">
            <DiceSelection dices={attack.dices} onDiceClick={removeDie} />
            {attack.dices.length === 0 && (
              <span className="text-ink-4 text-[10px] leading-none">
                {t('attack.noDice')}
              </span>
            )}
            <HitAndTotal breakdown={breakdown} />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer transition-opacity hover:opacity-70"
            title={t('attack.editDice')}
            onClick={() => setEditDices(true)}
          >
            <DiceSelection dices={attack.dices} />
            {attack.dices.length === 0 && (
              <span className="text-ink-4 text-[10px] leading-none">
                {t('attack.noDice')}
              </span>
            )}
          </button>
          <HitAndTotal breakdown={breakdown} />
        </div>
      )}
    </div>
  )
}

function HitAndTotal({ breakdown }: { breakdown: AttackBreakdown }) {
  const { t } = useTranslation()
  return (
    <>
      <span className="text-ink-3 ml-auto shrink-0 font-mono text-[9px] leading-none tabular-nums">
        {t('attack.hitPct', {
          percent: (breakdown.hitChance * 100).toFixed(1),
        })}
      </span>
      <span className="text-ink shrink-0 font-mono text-[13px] leading-none font-bold tabular-nums">
        {breakdown.total.toFixed(2)}
      </span>
    </>
  )
}

/**
 * One "where does this number come from" line: an ability the character
 * already has, plus a flat top-up for everything the calculator does not
 * model itself — a +1 weapon, a fighting style, a blessing.
 */
function BonusRow({
  label,
  ability,
  onAbilityChange,
  flat,
  onFlatChange,
  flatTitle,
}: {
  label: string
  ability?: AbilityType
  onAbilityChange: (ability: AbilityType | undefined) => void
  flat: number
  onFlatChange: (flat: number | null) => void
  flatTitle: string
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1">
      <span className={cn(microLabel, 'w-[42px] shrink-0')}>{label}</span>

      <div className="relative min-w-0 flex-1">
        <select
          className={cn(selectField, 'h-6')}
          value={ability ?? ''}
          onChange={(e) =>
            onAbilityChange((e.target.value as AbilityType) || undefined)
          }
        >
          <option value="">{t('attack.none')}</option>
          {ABILITIES.map((option) => (
            <option key={option} value={option}>
              {t(`abilities.${option}`)}
            </option>
          ))}
        </select>
        <Chevron className="text-ink-3 pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2" />
      </div>

      <InputNumber
        className={cn(
          'h-6 w-9 shrink-0 px-0 text-center text-[12px]',
          flat === 0 && 'text-ink-3'
        )}
        title={flatTitle}
        value={flat}
        regex={/^$|^[+-]$|^[+-]?\d{1,2}$/}
        format={(value) => (value > 0 ? `+${value}` : String(value))}
        onChange={onFlatChange}
      />
    </div>
  )
}
