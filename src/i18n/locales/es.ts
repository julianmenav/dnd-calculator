import type { Translation } from './en'

/**
 * Spanish locale, following the official D&D 5e Spanish glossary:
 * AC → CA, feat → dote, hit → impacto, proficiency → competencia,
 * abilities FUE/DES/CON/INT/SAB/CAR.
 */
const es: Translation = {
  app: {
    docTitle: 'Calculadora D&D',
    title: 'CALCULADORA D&D',
    tagline: 'daño medio · comparación de builds',
    defaultEnemyAc: 'CA enemiga por defecto',
    lowerAc: 'Bajar la CA objetivo',
    raiseAc: 'Subir la CA objetivo',
    addCharacter: 'Añadir personaje',
  },

  summary: {
    builds: 'Builds',
    turns: 'Turnos',
    best: 'Mejor',
    spread: 'Rango',
    median: 'Mediana',
  },

  character: {
    namePlaceholder: 'Nombre del personaje',
    level: 'Nvl',
    expand: 'Expandir',
    compact: 'Compactar',
    duplicate: 'Duplicar personaje',
    remove: 'Eliminar personaje',
    addTurn: 'Añadir turno',
    unnamed: 'Sin nombre',
  },

  turn: {
    namePlaceholder: 'Nombre del turno',
    rankOf: 'Puesto {{rank}} de {{total}}',
    baselineSet: 'Comparar todos los turnos contra este',
    baselineUnset: 'Dejar de comparar contra este turno',
    duplicate: 'Duplicar turno',
    remove: 'Eliminar turno',
    enemyAc: 'CA enemiga',
    inherit: 'hereda {{ac}}',
    useScenarioAc: 'Usar la CA del escenario',
    overrideAc: 'Cambiar la CA solo para este turno',
    acBadge: 'CA {{ac}}',
    avgDmg: 'daño medio',
    baseline: 'referencia',
    baselineMarker: 'Referencia',
    shareOfBest: '{{percent}}% del mejor turno del escenario',
    hit: 'Imp',
    crit: 'Crít',
    atk: 'Atq',
    atks: 'Atqs',
    unnamed: 'Turno sin nombre',
    unnamedLower: 'turno sin nombre',
  },

  attack: {
    attack: 'Ataque',
    damage: 'Daño',
    attackFlatTitle: 'Bono fijo a la tirada de ataque, p. ej. un arma +1',
    damageFlatTitle: 'Bono fijo al daño al impactar, p. ej. un arma +1',
    remove: 'Eliminar ataque',
    duplicate: 'Duplicar ataque',
    feats: 'Dotes',
    editDice: 'Editar dados',
    done: 'Hecho',
    noDice: 'sin dados',
    hitPct: 'imp {{percent}}%',
    none: 'Ninguna',
    add: 'Añadir ataque',
    new: 'Nuevo ataque',
    cancel: 'Cancelar',
    picked: 'Elegidos',
    removeDie: 'Quitar un d{{dice}}',
  },

  sources: {
    dice: 'Dados',
    crit: 'Crít',
    ability: 'Carac',
    bonus: 'Bono',
    feat: 'Dote',
  },

  analysis: {
    curveTitle: 'Daño vs CA enemiga',
    acRange: 'CA {{min}}–{{max}}',
    enemyAcAxis: 'CA ENEMIGA',
    enemyAcAt: 'CA ENEMIGA {{ac}}',
    ranking: 'Clasificación',
    rankingAc: 'CA {{ac}}',
    vsBaseline: ' · vs referencia',
    base: 'BASE',
    crossovers: 'Puntos de cruce',
    crossoversHint: 'donde dos turnos de un personaje se cruzan',
    fallsBehind: '{{loser}} queda por detrás de {{winner}}',
    bothLand: '{{name}} · ambos hacen {{damage}} aquí',
    crossoverAc: 'CA {{ac}}',
    moreCrossings_one: '{{count}} cruce más sin mostrar.',
    moreCrossings_other: '{{count}} cruces más sin mostrar.',
    deltaTitle:
      '{{sign}}{{difference}} ({{sign}}{{percent}}%) respecto a la referencia',
  },

  abilities: {
    Strength: 'Fuerza',
    Dexterity: 'Destreza',
    Constitution: 'Constitución',
    Intelligence: 'Inteligencia',
    Wisdom: 'Sabiduría',
    Charisma: 'Carisma',
  },

  abilitiesShort: {
    Strength: 'Fue',
    Dexterity: 'Des',
    Constitution: 'Con',
    Intelligence: 'Int',
    Wisdom: 'Sab',
    Charisma: 'Car',
  },

  feats: {
    'GW Master': 'Maestro armas grandes',
    'GW Fighter': 'Lucha armas grandes',
    Advantage: 'Ventaja',
    Crit: 'Crítico',
    Precision: 'Precisión',
    Champion: 'Campeón',
    Piercer: 'Perforador',
    Duelist: 'Duelista',
    Proficiency: 'Competencia',
  },

  featEffects: {
    'GW Master': '−5 imp · +10 daño',
    'GW Fighter': 'repite 1–2',
    Advantage: 'tira dos veces',
    Crit: 'siempre crítico',
    Precision: '+d8 al impacto',
    Champion: 'crítico con 19+',
    Piercer: 'repite un dado · ×3 crít',
    Duelist: '+2 daño',
    Proficiency: '+comp al daño',
  },
}

export default es
