import { ScenarioProvider } from '../context/ScenarioContext'
import Plus from '../icons/Plus'
import { useScenarioStore } from '../store/scenarioStore'
import CharacterComponent from './Character'
import InputNumber from './InputNumber'

function Scenario() {
  const scenario = useScenarioStore((state) => state.scenario)

  const { addCharacter, updateEnemyAc } = useScenarioStore(
    (state) => state.actions
  )

  return (
    <ScenarioProvider value={scenario}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-row items-center justify-between p-3">
          <h1 className="text-2xl font-bold text-white">D&D Calculator</h1>
          <div className="flex flex-row items-center gap-3">
            <div className="flex gap-2">
              <label className="label">
                <span className="label-text">DefaultEnemy AC</span>
              </label>
              <InputNumber
                className="input input-sm bg-secondary text-secondary-content border-0"
                value={scenario.enemyAc}
                regex={/^$|^-?$|^-?\d{1,2}$/}
                onChange={(value) => updateEnemyAc(value ?? 0)}
              />
            </div>
            <button
              className="btn btn-accent btn-sm"
              onClick={() => addCharacter()}
            >
              <Plus />
              Add Character
            </button>
          </div>
        </div>
        <div className="overflow-x-auto px-2 py-5 h-full">
          <div className="flex flex-row justify-center gap-3 min-w-max h-full">
            {scenario.characters.map((char) => (
              <CharacterComponent key={char.id} character={char} />
            ))}
          </div>
        </div>
      </div>
    </ScenarioProvider>
  )
}

export default Scenario
