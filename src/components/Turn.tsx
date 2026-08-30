import { useTranslation } from 'react-i18next'
import { useCharacter } from '../context/CharacterContext'
import { useAnalysis } from '../context/AnalysisContext'
import { useScenario } from '../context/ScenarioContext'
import { TurnProvider } from '../context/TurnContext'
import X from '../icons/X'
import type { Turn } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import AttackComponent from './Attack'
import DiceChooser from './DiceChooser'
import { calculateTurnBreakdown } from '../lib/calculator'
import { useMemo } from 'react'
import Copy from '../icons/Copy'
import Baseline from '../icons/Baseline'
import InputNumber from './InputNumber'
import DamageSources from './DamageSources'
import Delta from './Delta'
import { cn } from '../lib/utils'
import {
  buildAccent,
  field,
  iconBtnDangerSm,
  iconBtnSm,
  microLabel,
} from '../lib/ui'

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { t } = useTranslation()
  const { updateTurn, copyTurn, removeTurn, toggleBaseline } =
    useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const scenario = useScenario()

  const breakdown = useMemo(
    () => calculateTurnBreakdown(turn, character, scenario),
    [turn, character, scenario]
  )

  const overridesAc = turn.enemyAc !== undefined

  const analysis = useAnalysis()
  const row = analysis.byTurnId[turn.id]
  // A rank of 1 out of 1 says nothing.
  const ranked = analysis.turnCount > 1 && row !== undefined
  const shareOfBest =
    analysis.best > 0 ? (breakdown.total / analysis.best) * 100 : 0

  const baselineTurnId = useScenarioStore((state) => state.baselineTurnId)
  const isBaseline = baselineTurnId === turn.id
  // A baseline pointing at a deleted turn is simply no baseline.
  const baselineTotal = baselineTurnId
    ? analysis.byTurnId[baselineTurnId]?.breakdown.total
    : undefined
  const baselineShare =
    baselineTotal !== undefined && analysis.best > 0
      ? (baselineTotal / analysis.best) * 100
      : undefined

  return (
    <TurnProvider value={turn}>
      <article
        className={cn(
          'border-line bg-card rounded-card flex flex-col gap-3 border p-3',
          character.compactMode ? 'w-full' : 'w-[280px] shrink-0'
        )}
      >
        <div className="flex items-center gap-2">
          {ranked && (
            <span
              className={cn(
                'rounded-field flex h-[22px] w-[22px] shrink-0 items-center justify-center font-mono text-[10px] font-bold',
                row.rank === 1
                  ? 'bg-accent text-accent-ink'
                  : 'bg-line text-ink-2'
              )}
              title={t('turn.rankOf', {
                rank: row.rank,
                total: analysis.turnCount,
              })}
            >
              {row.rank}
            </span>
          )}

          <input
            className={cn(field, 'min-w-0 flex-grow font-semibold')}
            placeholder={t('turn.namePlaceholder')}
            value={turn.name}
            onChange={(e) =>
              updateTurn(character.id, turn.id, { name: e.target.value })
            }
          />

          {!character.compactMode && (
            <>
              <button
                className={cn(
                  iconBtnSm,
                  isBaseline && 'border-accent text-accent'
                )}
                title={
                  isBaseline ? t('turn.baselineUnset') : t('turn.baselineSet')
                }
                onClick={() => toggleBaseline(turn.id)}
              >
                <Baseline className="h-[11px] w-[11px]" />
              </button>
              <button
                className={iconBtnSm}
                title={t('turn.duplicate')}
                onClick={() => copyTurn(character.id, turn.id)}
              >
                <Copy />
              </button>
              <button
                className={iconBtnDangerSm}
                title={t('turn.remove')}
                onClick={() => removeTurn(character.id, turn.id)}
              >
                <X />
              </button>
            </>
          )}
        </div>

        {!character.compactMode ? (
          <div className="border-line bg-panel rounded-field flex h-8 items-center gap-2 border pr-1 pl-2">
            <span className={microLabel}>{t('turn.enemyAc')}</span>

            {overridesAc ? (
              <InputNumber
                className="text-accent h-6 w-10 border-transparent bg-transparent text-center font-bold hover:border-transparent"
                value={turn.enemyAc ?? scenario.enemyAc}
                regex={/^$|^\d{1,2}$/}
                onChange={(value) =>
                  updateTurn(character.id, turn.id, {
                    enemyAc: value ?? scenario.enemyAc,
                  })
                }
              />
            ) : (
              <span className="text-ink-4 flex-grow text-right font-mono text-[12px]">
                {t('turn.inherit', { ac: scenario.enemyAc })}
              </span>
            )}

            <button
              className={cn(
                'flex h-[17px] w-[30px] shrink-0 cursor-pointer items-center rounded-full border-0 p-[2px] transition-colors',
                overridesAc ? 'bg-accent justify-end' : 'bg-line justify-start'
              )}
              title={
                overridesAc ? t('turn.useScenarioAc') : t('turn.overrideAc')
              }
              onClick={() =>
                updateTurn(character.id, turn.id, {
                  enemyAc: overridesAc ? undefined : scenario.enemyAc,
                })
              }
            >
              <span
                className={cn(
                  'h-[13px] w-[13px] rounded-full transition-colors',
                  overridesAc ? 'bg-accent-ink' : 'bg-ink-4'
                )}
              />
            </button>
          </div>
        ) : (
          overridesAc && (
            <span className="border-accent/40 bg-accent/10 text-accent rounded-field self-start border px-1.5 py-1 font-mono text-[10px] leading-none font-bold">
              {t('turn.acBadge', { ac: turn.enemyAc })}
            </span>
          )
        )}

        <div className="flex items-end gap-2">
          <span className="text-ink font-mono text-[34px] leading-[0.85] font-bold tracking-[-0.03em] tabular-nums">
            {breakdown.total.toFixed(2)}
          </span>
          <span
            className={cn(
              microLabel,
              'pb-[3px] tracking-[0.14em] whitespace-nowrap'
            )}
          >
            {t('turn.avgDmg')}
          </span>

          {isBaseline ? (
            <span
              className={cn(
                microLabel,
                'border-edge rounded-field ml-auto border border-dashed px-1.5 py-1 tracking-[0.12em]'
              )}
            >
              {t('turn.baseline')}
            </span>
          ) : (
            baselineTotal !== undefined && (
              <Delta
                compact
                className="ml-auto"
                value={breakdown.total}
                baseline={baselineTotal}
              />
            )
          )}
        </div>

        {ranked && (
          <div
            className="bg-panel rounded-chip relative h-1.5 w-full"
            title={t('turn.shareOfBest', { percent: shareOfBest.toFixed(0) })}
          >
            <div
              className={cn(
                'rounded-chip h-1.5',
                buildAccent(row.characterIndex)
              )}
              style={{ width: `${shareOfBest}%` }}
            />
            {baselineShare !== undefined && (
              <span
                className="bg-ink-2 absolute top-[-3px] h-3 w-px"
                style={{ left: `${baselineShare}%` }}
                title={t('turn.baselineMarker')}
              />
            )}
          </div>
        )}

        {!character.compactMode && breakdown.attacks.length > 0 && (
          <div className="border-line bg-line rounded-field grid grid-cols-4 gap-px overflow-hidden border">
            <Stat
              label={t('turn.hit')}
              value={spread(breakdown.attacks.map((a) => a.hitChance), percent)}
            />
            <Stat
              label={t('turn.crit')}
              value={spread(breakdown.attacks.map((a) => a.critChance), percent)}
            />
            <Stat
              label={t('turn.atk')}
              value={spread(breakdown.attacks.map((a) => a.attackBonus), signed)}
            />
            <Stat
              label={t('turn.atks')}
              value={String(breakdown.attacks.length)}
            />
          </div>
        )}

        {!character.compactMode && <DamageSources breakdown={breakdown} />}

        {!character.compactMode && (
          <div className="flex flex-grow flex-col gap-3">
            <DiceChooser />

            {turn.attacks.length > 0 && (
              <div className="flex flex-grow flex-col gap-2">
                {turn.attacks.map((attack, index) => (
                  <AttackComponent
                    key={attack.id}
                    attack={attack}
                    breakdown={breakdown.attacks[index]}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </article>
    </TurnProvider>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-panel flex flex-col gap-1 px-2 py-1.5">
      <span className={cn(microLabel, 'tracking-[0.12em]')}>{label}</span>
      <span className="text-ink font-mono text-[11px] leading-none tabular-nums">
        {value}
      </span>
    </div>
  )
}

const percent = (value: number) => `${(value * 100).toFixed(1)}%`
const signed = (value: number) =>
  `${value < 0 ? '−' : '+'}${Math.abs(Math.round(value * 10) / 10)}`

/**
 * Attacks in a turn rarely agree — one carries Precision, the rest do not —
 * so a single figure would be a lie. Collapse to one value when they match
 * and to a range when they do not, rounding the range so it still fits.
 */
const spread = (values: number[], format: (value: number) => string) => {
  const low = Math.min(...values)
  const high = Math.max(...values)
  if (low === high) return format(low)
  return `${format(low).replace(/\.\d+/, '')}–${format(high).replace(/\.\d+/, '')}`
}
