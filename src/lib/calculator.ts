import type { Attack, Character, Feat, Scenario, Turn } from '../models'

export const calculateTurnDamage = (
  turn: Turn,
  character: Character,
  scenario: Scenario
): number => {
  const turnDamage = turn.attacks.reduce((total, attack) => {
    const attackBonus = getAttackBonus(attack, character)
    const damageBonus = getDamageBonus(attack, character)

    const dicesDamage = getDicesDamage(attack)
    const hitChance = getHitChance(attack, turn, scenario, attackBonus)
    const critChance = getCritChanceGivenHitLanded(attack, hitChance)

    const finalAverageDicesDamage = getAverageDicesDamage(
      dicesDamage,
      hitChance,
      critChance,
      attack
    )
    const averageDamageBonus = damageBonus * hitChance

    const attackAverageDamage = finalAverageDicesDamage + averageDamageBonus

    return total + attackAverageDamage
  }, 0)

  return turnDamage
}

// TODO: Order and group this functions in some way.
const getHitChance = (
  attack: Attack,
  turn: Turn,
  scenario: Scenario,
  attackBonus: number
): number => {
  const enemyAc = turn.enemyAc ?? scenario.enemyAc
  if (enemyAc === undefined) return 1

  const totalOutcomes = 20

  // TODO: All related to champion feat should improve at higher levels.
  const numberOfCritOutcomes = attackIncludesFeat(attack, 'Champion') ? 2 : 1 // 20 always hits. 19 also with champion feat.
  // Minimum number of dice outcomes that will land a hit.
  const minHittingOutcomes = numberOfCritOutcomes

  const numberOfAlwaysFailingOutcomes = 1 // 1 always fails
  // Maximun number of dice outcomes that will land a hit.
  const maxHittingOutcomes = totalOutcomes - numberOfAlwaysFailingOutcomes

  /**
   *  Hit probability:
   *   - Without advantage: number of successful outcomes / total number of outcomes
   *      * Rolling a 1 ALWAYS misses, and rolling a 20 ALWAYS hits.
   *   - With advantage: Inverse probability of both dice failing: 1 - ((failing outcomes / total outcomes) * (failing outcomes / total outcomes))
   *      * Rolling double 1s ALWAYS misses, and rolling at least one 20 guarantees a hit.
   */

  if (attackIncludesFeat(attack, 'Advantage')) {
    const numberOfHittingOutcomes = totalOutcomes - enemyAc + attackBonus + 1
    return (
      Math.max(
        Math.min(numberOfHittingOutcomes, maxHittingOutcomes),
        minHittingOutcomes
      ) / totalOutcomes
    )
  } else {
    const numberOfFailingOutcomes = enemyAc - 1 - attackBonus
    return (
      1 -
      (Math.max(
        Math.min(numberOfFailingOutcomes, maxHittingOutcomes),
        minHittingOutcomes
      ) /
        totalOutcomes) **
        2
    )
  }
}

// Average dices damage without counting hit chance.
const getDicesDamage = (attack: Attack): number => {
  return attack.dices.reduce((total, dice) => total + averageDiceRoll(dice), 0)
}

// If we know the hit has landed, we can calculate the crit chance using the intersection.
const getCritChanceGivenHitLanded = (
  attack: Attack,
  hitChance: number
): number => {
  if (attackIncludesFeat(attack, 'Crit')) return 1
  const critChance = attackIncludesFeat(attack, 'Champion') ? 2 / 20 : 1 / 20
  return critChance / hitChance
}

// Average dices damage considering hit chance and crit chance.
const getAverageDicesDamage = (
  dicesDamage: number,
  hitChance: number,
  critChance: number,
  attack: Attack
): number => {
  const critMultiplier = attackIncludesFeat(attack, 'Piercer') ? 3 : 2

  // Expected damage if landed.
  const expectedNormalDamageAvg = dicesDamage * (1 - critChance)
  const expectedCritDamageAvg = dicesDamage * critMultiplier * critChance
  const expectedDamageAvg = expectedNormalDamageAvg + expectedCritDamageAvg

  // So... expected damage considering hit chance is...
  return expectedDamageAvg * hitChance
}

/**
 *  Bonus to attack roll to increase hitting chance.
 */
const getAttackBonus = (attack: Attack, character: Character): number => {
  // Bonus based on lvl and ability score.
  let abilityScore = 0
  if (attack.attackBonusAbility) {
    abilityScore = character.abilities[attack.attackBonusAbility] ?? 0
  }
  let attackBonus = abilityScore + getProfienciencyBonus(character.lvl)

  // Add feats bonuses.
  if (attackIncludesFeat(attack, 'Precision')) {
    attackBonus += averageDiceRoll(8) // Precision feat adds the result of a d8 to the attack bonus.
  }
  if (attackIncludesFeat(attack, 'Heavy Weap.')) {
    attackBonus -= 5 // Heavy weapon feat reduces the attack bonus by 5.
  }
  return attackBonus
}

/**
 *  Bonus to damage roll to increase damage in case of hit.
 */
const getDamageBonus = (attack: Attack, character: Character): number => {
  let abilityScore = 0
  if (attack.damageBonusAbility) {
    abilityScore = character.abilities[attack.damageBonusAbility] ?? 0
  }

  let featBonus = 0
  if (attackIncludesFeat(attack, 'Heavy Weap.')) featBonus += 10
  if (attackIncludesFeat(attack, 'Duelist')) featBonus += 2

  return abilityScore + featBonus
}

const attackIncludesFeat = (attack: Attack, feat: Feat): boolean => {
  return attack.feats.includes(feat)
}

const averageDiceRoll = (dice: number): number => {
  return (dice + 1) / 2
}

const getProfienciencyBonus = (level: number): number => {
  if (level < 5) return 2
  if (level < 9) return 3
  if (level < 13) return 4
  if (level < 17) return 5
  return 6
}
