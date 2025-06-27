export type Dice = 4 | 6 | 8 | 10 | 12 | 20
export const DICE_SIDES: Dice[] = [4, 6, 8, 10, 12, 20]
export const DICE_COLORS: Record<Dice, Record<string, string>> = {
  4: { background: 'bg-green-800', text: 'text-white' },
  6: { background: 'bg-orange-500', text: 'text-white' },
  8: { background: 'bg-blue-800', text: 'text-white' },
  10: { background: 'bg-red-700', text: 'text-white' },
  12: { background: 'bg-purple-800', text: 'text-white' },
  20: { background: 'bg-yellow-600', text: 'text-white' },
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
