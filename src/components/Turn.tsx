import { useCharacter } from '../context/CharacterContext'
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
import InputNumber from './InputNumber'
import { cn } from '../lib/utils'
import { field, iconBtnDangerSm, iconBtnSm, microLabel } from '../lib/ui'

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { updateTurn, copyTurn, removeTurn } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const scenario = useScenario()

  const breakdown = useMemo(
    () => calculateTurnBreakdown(turn, character, scenario),
    [turn, character, scenario]
  )

  const overridesAc = turn.enemyAc !== undefined

  return (
    <TurnProvider value={turn}>
      <article
        className={cn(
          'border-line bg-card rounded-card flex flex-col gap-3 border p-3',
          character.compactMode ? 'w-full' : 'w-[280px] shrink-0'
        )}
      >
        <div className="flex items-center gap-2">
          <input
            className={cn(field, 'min-w-0 flex-grow font-semibold')}
            placeholder="Turn name"
            value={turn.name}
            onChange={(e) =>
              updateTurn(character.id, turn.id, { name: e.target.value })
            }
          />

          {!character.compactMode && (
            <>
              <button
                className={iconBtnSm}
                title="Duplicate turn"
                onClick={() => copyTurn(character.id, turn.id)}
              >
                <Copy />
              </button>
              <button
                className={iconBtnDangerSm}
                title="Remove turn"
                onClick={() => removeTurn(character.id, turn.id)}
              >
                <X />
              </button>
            </>
          )}
        </div>

        {!character.compactMode ? (
          <div className="border-line bg-panel rounded-field flex h-8 items-center gap-2 border pr-1 pl-2">
            <span className={microLabel}>Enemy AC</span>

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
                inherit {scenario.enemyAc}
              </span>
            )}

            <button
              className={cn(
                'flex h-[17px] w-[30px] shrink-0 cursor-pointer items-center rounded-full border-0 p-[2px] transition-colors',
                overridesAc ? 'bg-accent justify-end' : 'bg-line justify-start'
              )}
              title={overridesAc ? 'Use the scenario AC' : 'Override the AC for this turn'}
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
              AC {turn.enemyAc}
            </span>
          )
        )}

        <div className="flex items-end gap-2">
          <span className="text-ink font-mono text-[34px] leading-[0.85] font-bold tracking-[-0.03em] tabular-nums">
            {breakdown.total.toFixed(2)}
          </span>
          <span className={cn(microLabel, 'pb-[3px] tracking-[0.14em]')}>
            avg dmg
          </span>
        </div>

        {!character.compactMode && (
          <div className="flex flex-grow flex-col gap-3">
            <DiceChooser />

            {turn.attacks.length > 0 && (
              <div className="flex flex-grow flex-col gap-2">
                {turn.attacks.map((attack) => (
                  <AttackComponent key={attack.id} attack={attack} />
                ))}
              </div>
            )}
          </div>
        )}
      </article>
    </TurnProvider>
  )
}
