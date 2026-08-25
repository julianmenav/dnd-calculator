import { useCharacter } from '../context/CharacterContext'
import { useScenario } from '../context/ScenarioContext'
import { TurnProvider } from '../context/TurnContext'
import X from '../icons/X'
import type { Turn } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import AttackComponent from './Attack'
import DiceChooser from './DiceChooser'
import { calculateTurnDamage } from '../lib/calculator'
import { useEffect, useState } from 'react'
import Copy from '../icons/Copy'
import { cn } from '../lib/utils'
import { field, iconBtnDangerSm, iconBtnSm, microLabel } from '../lib/ui'

export default function TurnComponent({ turn }: { turn: Turn }) {
  const { updateTurn, copyTurn, removeTurn } = useScenarioStore(
    (state) => state.actions
  )
  const character = useCharacter()
  const scenario = useScenario()

  const [avgDamage, setAvgDamage] = useState<number>(0)

  useEffect(() => {
    const damage = calculateTurnDamage(turn, character, scenario)
    setAvgDamage(damage)
  }, [turn, character, scenario])

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

        {/* <label className="border-line bg-panel rounded-field flex items-center gap-2 border px-2 py-1">
          <span className={microLabel}>Enemy AC</span>
          <input
            className="text-ink w-full bg-transparent text-right font-mono text-[12px] outline-none"
            type="text"
            value={turn.enemyAc ?? scenario.enemyAc}
            onChange={(e) =>
              updateTurn(character.id, turn.id, {
                enemyAc: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </label> */}

        <div className="flex items-end gap-2">
          <span className="text-ink font-mono text-[34px] leading-[0.85] font-bold tracking-[-0.03em] tabular-nums">
            {avgDamage.toFixed(2)}
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
