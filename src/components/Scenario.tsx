import { useMemo } from 'react'
import { ScenarioProvider } from '../context/ScenarioContext'
import { AnalysisProvider } from '../context/AnalysisContext'
import { analyseScenario } from '../lib/analysis'
import D20 from '../icons/D20'
import Plus from '../icons/Plus'
import Minus from '../icons/Minus'
import { useScenarioStore } from '../store/scenarioStore'
import CharacterComponent from './Character'
import InputNumber from './InputNumber'
import ScenarioSummary from './ScenarioSummary'
import AnalysisSection from './AnalysisSection'
import { btnPrimary, iconBtn, microLabel } from '../lib/ui'

function Scenario() {
  const scenario = useScenarioStore((state) => state.scenario)

  const { addCharacter, updateEnemyAc } = useScenarioStore(
    (state) => state.actions
  )

  // Same bounds the AC field's own regex allows, so typing and stepping agree.
  const stepAc = (delta: number) =>
    updateEnemyAc(Math.min(99, Math.max(0, scenario.enemyAc + delta)))

  /**
   * Every derived figure in the app comes from here — ranks, spreads, curves.
   * Computed once per scenario change rather than per card, since a card
   * cannot see its siblings.
   */
  const analysis = useMemo(() => analyseScenario(scenario), [scenario])

  return (
    <ScenarioProvider value={scenario}>
      <AnalysisProvider value={analysis}>
        <div className="flex min-h-screen w-full flex-col">
          <header className="border-rule bg-chrome flex h-[58px] shrink-0 items-center justify-between gap-4 border-b px-4">
            <div className="flex items-center gap-2.5">
              <D20 className="text-accent h-[26px] w-[26px]" />
              <div className="flex flex-col gap-[3px]">
                <h1 className="text-ink text-sm leading-none font-bold tracking-[0.16em]">
                  D&D CALCULATOR
                </h1>
                <span className="text-ink-3 text-[9px] leading-none tracking-[0.14em] uppercase">
                  average damage · build comparison
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="border-edge bg-raised/60 rounded-field flex items-center gap-2.5 border py-1 pr-1 pl-2.5">
                <span className={microLabel}>Default enemy AC</span>
                <div className="flex items-center gap-0.5">
                  <button
                    className={iconBtn}
                    title="Lower the target AC"
                    onClick={() => stepAc(-1)}
                  >
                    <Minus />
                  </button>
                  <InputNumber
                    className="text-accent h-[26px] w-11 border-transparent bg-transparent text-center text-[15px] font-bold hover:border-transparent"
                    value={scenario.enemyAc}
                    regex={/^$|^-?$|^-?\d{1,2}$/}
                    onChange={(value) => updateEnemyAc(value ?? 0)}
                  />
                  <button
                    className={iconBtn}
                    title="Raise the target AC"
                    onClick={() => stepAc(1)}
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <button className={btnPrimary} onClick={() => addCharacter()}>
                <Plus />
                Add character
              </button>
            </div>
          </header>

          <ScenarioSummary />

          {/* rotate trick keeps the horizontal scrollbar above the columns */}
          <div className="h-full rotate-180 overflow-x-auto px-4 py-4 [direction:rtl]">
            <div className="flex h-full min-w-max rotate-180 flex-row justify-center gap-3 [direction:ltr]">
              {scenario.characters.map((char, index) => (
                <CharacterComponent
                  key={char.id}
                  character={char}
                  index={index}
                />
              ))}
            </div>
          </div>

          <AnalysisSection />
        </div>
      </AnalysisProvider>
    </ScenarioProvider>
  )
}

export default Scenario
