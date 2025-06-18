import { ScenarioProvider } from '../context/ScenarioContext'
import { useScenarioStore } from '../store/scenarioStore'
import CharacterComponent from './Character'

function Scenario() {
  const scenario = useScenarioStore((state) => state.scenario)

  const { addCharacter, updateEnemyAc } = useScenarioStore(
    (state) => state.actions
  )

  return (
    <ScenarioProvider value={scenario}>
      <div className="flex w-full flex-col gap-3 p-5 px-12">
        <div>
          <div className="flex w-24 flex-col">
            <label className="label">
              <span className="label-text">Enemy AC</span>
            </label>
            <input
              type="number"
              className="input input-xs"
              min={0}
              max={30}
              value={scenario.enemyAc}
              onChange={(e) => updateEnemyAc(Number(e.target.value))}
            />
          </div>
          <button
            className="btn btn-primary btn-xs"
            onClick={() => addCharacter()}
          >
            Add Character
          </button>
          <div className="flex flex-col gap-3 py-5">
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
