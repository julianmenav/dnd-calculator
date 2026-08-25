export type Dice = 4 | 6 | 8 | 10 | 12 | 20
export const DICE_SIDES: Dice[] = [4, 6, 8, 10, 12, 20]
/** Tinted chip: fill / border / label, one entry per die. Always paired with a text label. */
export const DICE_COLORS: Record<Dice, string> = {
  4: 'bg-d4/15 border-d4/45 text-d4-ink',
  6: 'bg-d6/15 border-d6/45 text-d6-ink',
  8: 'bg-d8/15 border-d8/45 text-d8-ink',
  10: 'bg-d10/15 border-d10/45 text-d10-ink',
  12: 'bg-d12/15 border-d12/45 text-d12-ink',
  20: 'bg-d20/15 border-d20/45 text-d20-ink',
}

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

export type Feat =
  | 'GW Master'
  | 'GW Fighter'
  | 'Advantage'
  | 'Crit'
  | 'Precision'
  | 'Champion'
  | 'Piercer'
  | 'Duelist'
export const FEATS: Feat[] = [
  'GW Master',
  'GW Fighter',
  'Advantage',
  'Crit',
  'Precision',
  'Champion',
  'Piercer',
  'Duelist',
]

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
  compactMode: boolean
}

export type Scenario = {
  enemyAc: number
  characters: Character[]
}
