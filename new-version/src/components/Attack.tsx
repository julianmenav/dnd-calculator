import { useCharacter } from '../context/CharacterContext'
import { useTurn } from '../context/TurnContext'
import type { Attack, Turn } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import { DICE_SIDES } from '../models'

export default function AttackComponent({ attack }: { attack: Attack }) {
  const { updateAttack } = useScenarioStore((state) => state.actions)
  const character = useCharacter()
  const turn = useTurn()

  return (
    <div className="w-full">
      <div>
        {attack.dices.map((dice, index) => (
          <p key={index}>{`d${dice}`}</p>
        ))}
      </div>
    </div>
  )
}
