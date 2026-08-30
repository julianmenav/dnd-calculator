import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
import { LANGUAGES } from '../i18n'
import { cn } from '../lib/utils'

function Scenario() {
  const { t } = useTranslation()
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
                  {t('app.title')}
                </h1>
                <span className="text-ink-3 text-[9px] leading-none tracking-[0.14em] uppercase">
                  {t('app.tagline')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <LanguageToggle />

              <div className="border-edge bg-raised/60 rounded-field flex items-center gap-2.5 border py-1 pr-1 pl-2.5">
                <span className={microLabel}>{t('app.defaultEnemyAc')}</span>
                <div className="flex items-center gap-0.5">
                  <button
                    className={iconBtn}
                    title={t('app.lowerAc')}
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
                    title={t('app.raiseAc')}
                    onClick={() => stepAc(1)}
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <button className={btnPrimary} onClick={() => addCharacter()}>
                <Plus />
                {t('app.addCharacter')}
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

/** ES/EN switch; the choice persists via the i18n module's localStorage sync. */
function LanguageToggle() {
  const { i18n } = useTranslation()

  return (
    <div className="border-edge bg-raised/60 rounded-field flex items-center gap-0.5 border p-0.5">
      {LANGUAGES.map((language) => (
        <button
          key={language}
          className={cn(
            'rounded-chip h-6 cursor-pointer border-0 px-2 font-mono text-[10px] font-bold uppercase transition-colors',
            i18n.resolvedLanguage === language
              ? 'bg-accent text-accent-ink'
              : 'text-ink-3 hover:text-ink bg-transparent'
          )}
          onClick={() => i18n.changeLanguage(language)}
        >
          {language}
        </button>
      ))}
    </div>
  )
}

export default Scenario
