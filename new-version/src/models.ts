export type Dice = 4 | 6 | 8 | 10 | 12 | 20
export const DICE_SIDES: Dice[] = [4, 6, 8, 10, 12, 20]

export type AbilityType =
  | 'Strength'
  | 'Dexterity'
  | 'Constitution'
  | 'Intelligence'
  | 'Wisdom'
  | 'Charisma'
export const ABILITIES: AbilityType[] = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
]

export type Feat = 'Heavy Weap.' | 'Advantage' | 'Crit' | 'Precision'
export const FEATS: Feat[] = ['Heavy Weap.', 'Advantage', 'Crit', 'Precision']

export type Attack = {
  id: string
  dices: Dice[]
  feats: string[]
  attackBonusAbility?: AbilityType
  damageBonusAbility?: AbilityType
}

export type Turn = {
  id: string
  name: string
  enemyAc?: number
  attacks: Attack[]
}

export type Character = {
  id: string
  name: string
  lvl: number
  abilities: Record<AbilityType, number> // from -5 to +5
  turns: Turn[]
}

export type Scenario = {
  enemyAc: number
  characters: Character[]
}
