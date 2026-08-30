/**
 * Every user-facing string in the app, in English. The Spanish counterpart
 * in `es.ts` is typed against this object, so a key added or removed here
 * is a compile error there until both files agree.
 */
const en = {
  app: {
    /** Browser tab title, kept in sync by the i18n init. */
    docTitle: 'D&D Calculator',
    title: 'D&D CALCULATOR',
    tagline: 'average damage · build comparison',
    defaultEnemyAc: 'Default enemy AC',
    lowerAc: 'Lower the target AC',
    raiseAc: 'Raise the target AC',
    addCharacter: 'Add character',
  },

  summary: {
    builds: 'Builds',
    turns: 'Turns',
    best: 'Best',
    spread: 'Spread',
    median: 'Median',
  },

  character: {
    namePlaceholder: 'Character name',
    level: 'LvL',
    expand: 'Expand',
    compact: 'Compact',
    duplicate: 'Duplicate character',
    remove: 'Remove character',
    addTurn: 'Add turn',
    unnamed: 'Unnamed',
  },

  turn: {
    namePlaceholder: 'Turn name',
    rankOf: 'Rank {{rank}} of {{total}}',
    baselineSet: 'Measure every turn against this one',
    baselineUnset: 'Stop measuring against this turn',
    duplicate: 'Duplicate turn',
    remove: 'Remove turn',
    enemyAc: 'Enemy AC',
    inherit: 'inherit {{ac}}',
    useScenarioAc: 'Use the scenario AC',
    overrideAc: 'Override the AC for this turn',
    acBadge: 'AC {{ac}}',
    avgDmg: 'avg dmg',
    baseline: 'baseline',
    baselineMarker: 'Baseline',
    shareOfBest: '{{percent}}% of the best turn in the scenario',
    hit: 'Hit',
    crit: 'Crit',
    atk: 'Atk',
    atks: 'Atks',
    unnamed: 'Unnamed turn',
    unnamedLower: 'unnamed turn',
  },

  attack: {
    attack: 'Attack',
    damage: 'Damage',
    attackFlatTitle: 'Flat bonus to the attack roll, e.g. a +1 weapon',
    damageFlatTitle: 'Flat bonus to damage on a hit, e.g. a +1 weapon',
    remove: 'Remove attack',
    duplicate: 'Duplicate attack',
    feats: 'Feats',
    editDice: 'Edit dice',
    done: 'Done',
    noDice: 'no dice',
    hitPct: 'hit {{percent}}%',
    none: 'None',
    add: 'Add attack',
    new: 'New attack',
    cancel: 'Cancel',
    picked: 'Picked',
    removeDie: 'Remove a d{{dice}}',
  },

  /** Legend of the damage-source breakdown bars. */
  sources: {
    dice: 'Dice',
    crit: 'Crit',
    ability: 'Abil',
    bonus: 'Bonus',
    feat: 'Feat',
  },

  analysis: {
    curveTitle: 'Damage vs enemy AC',
    acRange: 'AC {{min}}–{{max}}',
    enemyAcAxis: 'ENEMY AC',
    enemyAcAt: 'ENEMY AC {{ac}}',
    ranking: 'Ranking',
    rankingAc: 'AC {{ac}}',
    vsBaseline: ' · vs baseline',
    base: 'BASE',
    crossovers: 'Break-even points',
    crossoversHint: "where two of a character's turns swap places",
    fallsBehind: '{{loser}} falls behind {{winner}}',
    bothLand: '{{name}} · both land {{damage}} here',
    crossoverAc: 'AC {{ac}}',
    moreCrossings_one: '{{count}} more crossing not shown.',
    moreCrossings_other: '{{count}} more crossings not shown.',
    deltaTitle:
      '{{sign}}{{difference}} ({{sign}}{{percent}}%) against the baseline',
  },

  /**
   * Display names for the ability and feat identifiers persisted in the
   * store — the stored values themselves never change language.
   */
  abilities: {
    Strength: 'Strength',
    Dexterity: 'Dexterity',
    Constitution: 'Constitution',
    Intelligence: 'Intelligence',
    Wisdom: 'Wisdom',
    Charisma: 'Charisma',
  },

  abilitiesShort: {
    Strength: 'Str',
    Dexterity: 'Dex',
    Constitution: 'Con',
    Intelligence: 'Int',
    Wisdom: 'Wis',
    Charisma: 'Cha',
  },

  feats: {
    'GW Master': 'GW Master',
    'GW Fighter': 'GW Fighter',
    Advantage: 'Advantage',
    Crit: 'Crit',
    Precision: 'Precision',
    Champion: 'Champion',
    Piercer: 'Piercer',
    Duelist: 'Duelist',
    Proficiency: 'Proficiency',
  },

  /** What each feat toggle does to the maths, in the calculator's own terms. */
  featEffects: {
    'GW Master': '−5 hit · +10 dmg',
    'GW Fighter': 'reroll 1–2',
    Advantage: 'roll twice',
    Crit: 'always crits',
    Precision: '+d8 to hit',
    Champion: 'crit on 19+',
    Piercer: 'reroll a die · ×3 crit',
    Duelist: '+2 dmg',
    Proficiency: '+prof dmg',
  },
}

export default en

/** Structural shape shared by every locale; values widen to plain strings. */
export type Translation = typeof en
