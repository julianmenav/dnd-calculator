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
      <div className="scenario">
        <h2>Scenario</h2>
        <div>
          <label>Enemy AC: </label>
          <input
            type="number"
            value={scenario.enemyAc}
            onChange={(e) => updateEnemyAc(Number(e.target.value))}
          />
        </div>
        <button onClick={() => addCharacter()}>Add Character</button>
        <hr />
        <div className="flex flex-col gap-3">
          {scenario.characters.map((char) => (
            <CharacterComponent key={char.id} character={char} />
          ))}
        </div>
      </div>
    </ScenarioProvider>
  )
}

export default Scenario
