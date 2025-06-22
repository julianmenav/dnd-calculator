import { ScenarioProvider } from '../context/ScenarioContext'
import Plus from '../icons/Plus'
import { useScenarioStore } from '../store/scenarioStore'
import CharacterComponent from './Character'

function Scenario() {
  const scenario = useScenarioStore((state) => state.scenario)

  const { addCharacter, updateEnemyAc } = useScenarioStore(
    (state) => state.actions
  )

  return (
    <ScenarioProvider value={scenario}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-row items-center justify-between p-3">
          <h1 className="text-accent text-2xl font-bold">D&D Calculator</h1>
          <div className="flex flex-row items-center gap-3">
            <div className="flex gap-2">
              <label className="label">
                <span className="label-text">DefaultEnemy AC</span>
              </label>
              <input
                type="number"
                className="input input-sm border-0 bg-secondary text-secondary-content"
                min={0}
                max={30}
                value={scenario.enemyAc}
                onChange={(e) => updateEnemyAc(Number(e.target.value))}
              />
            </div>
            <button
              className="btn btn-success btn-sm"
              onClick={() => addCharacter()}
            >
              <Plus />
              Add Character
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-3 py-5 overflow-x-auto px-2">
          {scenario.characters.map((char) => (
            <CharacterComponent key={char.id} character={char} />
          ))}
        </div>
      </div>
    </ScenarioProvider>
  )
}

export default Scenario
