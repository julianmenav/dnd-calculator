import type { Attack, Character, Feat, Scenario, Turn } from '../models'

const totalOutcomes = 20 // A d20 attack roll.

/**
 * Where a single attack's average damage comes from. The four damage
 * components are disjoint and sum to `total`, so they can be stacked.
 */
export type AttackBreakdown = {
  attackBonus: number
  /** Chance this attack lands at all. */
  hitChance: number
  /** Absolute chance of a crit, not conditioned on the hit landing. */
  critChance: number
  /** Weapon and bonus dice, at their normal (non-crit) value. */
  dice: number
  /** The extra dice damage crits are expected to add on top. */
  crit: number
  /** Ability modifier applied on a hit. */
  ability: number
  /** Flat feat damage (GW Master, Duelist) applied on a hit. */
  feat: number
  total: number
}

export type TurnBreakdown = {
  total: number
  dice: number
  crit: number
  ability: number
  feat: number
  attacks: AttackBreakdown[]
}

export const calculateTurnBreakdown = (
  turn: Turn,
  character: Character,
  scenario: Scenario
): TurnBreakdown => {
  const attacks = turn.attacks.map((attack) =>
    calculateAttackBreakdown(attack, turn, character, scenario)
  )

  return attacks.reduce(
    (turnTotal, attack) => ({
      ...turnTotal,
      total: turnTotal.total + attack.total,
      dice: turnTotal.dice + attack.dice,
      crit: turnTotal.crit + attack.crit,
      ability: turnTotal.ability + attack.ability,
      feat: turnTotal.feat + attack.feat,
    }),
    { total: 0, dice: 0, crit: 0, ability: 0, feat: 0, attacks }
  )
}

const calculateAttackBreakdown = (
  attack: Attack,
  turn: Turn,
  character: Character,
  scenario: Scenario
): AttackBreakdown => {
  const attackBonus = getAttackBonus(attack, character)

  const dicesDamage = getDicesDamage(attack)
  const hitChance = getHitChance(attack, turn, scenario, attackBonus)
  const critChanceGivenHitLanded = getCritChanceGivenHitLanded(
    attack,
    hitChance
  )

  /**
   * A crit keeps the normal dice and adds (multiplier - 1) more sets of them,
   * which is what lets the normal roll and the crit uplift be reported apart
   * while still summing to the same expected damage.
   */
  const critMultiplier = getCritMultiplier(attack)
  const dice = dicesDamage * hitChance
  const crit =
    dicesDamage * (critMultiplier - 1) * critChanceGivenHitLanded * hitChance

  // Flat bonuses ride on the hit, and are not multiplied by a crit.
  const ability = getAbilityDamageBonus(attack, character) * hitChance
  const feat = getFeatDamageBonus(attack) * hitChance

  return {
    attackBonus,
    hitChance,
    critChance: critChanceGivenHitLanded * hitChance,
    dice,
    crit,
    ability,
    feat,
    total: dice + crit + ability + feat,
  }
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

  const numberOfCritOutcomes = getNumberOfCritOutcomes(attack)

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

  if (!attackIncludesFeat(attack, 'Advantage')) {
    const numberOfHittingOutcomes = totalOutcomes - enemyAc + attackBonus + 1
    return (
      Math.max(
        Math.min(numberOfHittingOutcomes, maxHittingOutcomes),
        minHittingOutcomes
      ) / totalOutcomes
    )
  } else {
    // A single die fails at most on everything below a crit, and at least on a 1.
    const maxFailingOutcomes = totalOutcomes - numberOfCritOutcomes
    const minFailingOutcomes = numberOfAlwaysFailingOutcomes

    const numberOfFailingOutcomes = enemyAc - 1 - attackBonus
    return (
      1 -
      (Math.max(
        Math.min(numberOfFailingOutcomes, maxFailingOutcomes),
        minFailingOutcomes
      ) /
        totalOutcomes) **
        2
    )
  }
}

// Average dices damage without counting hit chance.
const getDicesDamage = (attack: Attack): number => {
  let rerolls = 0;
  if (attackIncludesFeat(attack, 'Piercer')) {
    rerolls++
  }

  return attack.dices.reduce((total, dice) => {

    if (attackIncludesFeat(attack, 'GW Fighter')) {
      return total + averageRollWithGWF(dice)
    }
    if (rerolls > 0) {
      rerolls--
      return total + averageDiceRollWithSelectiveReroll(dice)
    }
    return total + averageDiceRoll(dice)
  }, 0)
}

// TODO: All related to champion feat should improve at higher levels.
// 20 always crits. 19 also with champion feat.
const getNumberOfCritOutcomes = (attack: Attack): number =>
  attackIncludesFeat(attack, 'Champion') ? 2 : 1

const getCritChance = (attack: Attack): number => {
  const singleRollCritChance = getNumberOfCritOutcomes(attack) / totalOutcomes

  // With advantage either die can land the crit, so it is the inverse
  // probability of neither of them rolling a crit outcome.
  if (attackIncludesFeat(attack, 'Advantage')) {
    return 1 - (1 - singleRollCritChance) ** 2
  }
  return singleRollCritChance
}

// If we know the hit has landed, we can calculate the crit chance using the intersection.
const getCritChanceGivenHitLanded = (
  attack: Attack,
  hitChance: number
): number => {
  if (attackIncludesFeat(attack, 'Crit')) return 1
  return getCritChance(attack) / hitChance
}

// How many times the damage dice are counted on a crit.
const getCritMultiplier = (attack: Attack): number =>
  attackIncludesFeat(attack, 'Piercer') ? 3 : 2

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
  if (attackIncludesFeat(attack, 'GW Master')) {
    attackBonus -= 5 // Heavy weapon feat reduces the attack bonus by 5.
  }
  return attackBonus
}

/**
 *  Ability modifier added to the damage roll on a hit.
 */
const getAbilityDamageBonus = (
  attack: Attack,
  character: Character
): number => {
  if (!attack.damageBonusAbility) return 0
  return character.abilities[attack.damageBonusAbility] ?? 0
}

/**
 *  Flat damage granted by feats on a hit.
 */
const getFeatDamageBonus = (attack: Attack): number => {
  let featBonus = 0
  if (attackIncludesFeat(attack, 'GW Master')) featBonus += 10
  if (attackIncludesFeat(attack, 'Duelist')) featBonus += 2

  return featBonus
}

const attackIncludesFeat = (attack: Attack, feat: Feat): boolean => {
  return attack.feats.includes(feat)
}

const averageDiceRoll = (dice: number): number => {
  return (dice + 1) / 2
}

// This function calculates the average dice roll considering the possibility of rerolling a die if it is worse than the average.
const averageDiceRollWithSelectiveReroll = (dice: number): number => {
  const baseAverage = averageDiceRoll(dice)

  let sum = 0
  for (let i = 1; i <= dice; i++) {
    const better = dice - i
    const worse = i - 1
    const value = better > worse ? baseAverage : i
    sum += value
  }

  return sum / dice
}

// This function calculates the average roll of a die with the GWF feat (rerolls on 1/2 results).
const averageRollWithGWF = (sides: number): number => {
  const baseAverage = averageDiceRoll(sides)
  const rerollAverage = baseAverage

  const rerollChance = 2 / sides
  const keepChance = 1 - rerollChance

  const keepAverage = (Array.from({ length: sides - 2 }, (_, i) => i + 3).reduce((a, b) => a + b, 0)) / (sides - 2)

  return rerollChance * rerollAverage + keepChance * keepAverage
}

const getProfienciencyBonus = (level: number): number => {
  if (level < 5) return 2
  if (level < 9) return 3
  if (level < 13) return 4
  if (level < 17) return 5
  return 6
}
