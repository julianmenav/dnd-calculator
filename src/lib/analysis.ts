import type { Scenario } from '../models'
import { calculateTurnBreakdown, type TurnBreakdown } from './calculator'

/** The AC band worth plotting: below 10 nothing misses, above 25 nothing lands. */
export const AC_MIN = 10
export const AC_MAX = 25
export const AC_RANGE = Array.from(
  { length: AC_MAX - AC_MIN + 1 },
  (_, index) => AC_MIN + index
)

export type TurnRow = {
  characterId: string
  characterName: string
  characterIndex: number
  turnId: string
  turnName: string
  /** Position within its own character, which is what picks the line style. */
  turnIndex: number
  breakdown: TurnBreakdown
  /** Average damage at each AC in AC_RANGE. */
  curve: number[]
  /** The AC this turn is actually being scored against right now. */
  effectiveAc: number
  /** 1-based, by damage at the current AC. */
  rank: number
}

export type Crossover = {
  characterName: string
  /** The turn that leads below the crossing and falls behind above it. */
  fallsBehind: string
  overtakenBy: string
  ac: number
}

export type ScenarioAnalysis = {
  rows: TurnRow[]
  /** Same rows, best first. */
  ranked: TurnRow[]
  byTurnId: Record<string, TurnRow>
  characterCount: number
  turnCount: number
  best: number
  worst: number
  spread: number
  median: number
  crossovers: Crossover[]
}

export const analyseScenario = (scenario: Scenario): ScenarioAnalysis => {
  const rows: TurnRow[] = []

  scenario.characters.forEach((character, characterIndex) => {
    character.turns.forEach((turn, turnIndex) => {
      rows.push({
        characterId: character.id,
        characterName: character.name,
        characterIndex,
        turnId: turn.id,
        turnName: turn.name,
        turnIndex,
        breakdown: calculateTurnBreakdown(turn, character, scenario),
        effectiveAc: turn.enemyAc ?? scenario.enemyAc,
        /**
         * Sweep the turn's own AC, not the scenario's, so a turn that pins an
         * override still answers "what would this do against AC x" rather than
         * drawing a flat line at its pinned value.
         */
        curve: AC_RANGE.map(
          (enemyAc) =>
            calculateTurnBreakdown({ ...turn, enemyAc }, character, scenario)
              .total
        ),
        rank: 0,
      })
    })
  })

  const ranked = [...rows].sort((a, b) => b.breakdown.total - a.breakdown.total)
  ranked.forEach((row, index) => {
    row.rank = index + 1
  })

  const totals = ranked.map((row) => row.breakdown.total)

  return {
    rows,
    ranked,
    byTurnId: Object.fromEntries(rows.map((row) => [row.turnId, row])),
    characterCount: scenario.characters.length,
    turnCount: rows.length,
    best: totals[0] ?? 0,
    worst: totals[totals.length - 1] ?? 0,
    spread: (totals[0] ?? 0) - (totals[totals.length - 1] ?? 0),
    median: medianOf(totals),
    crossovers: findCrossovers(rows),
  }
}

const medianOf = (sortedDescending: number[]): number => {
  if (sortedDescending.length === 0) return 0
  const middle = Math.floor(sortedDescending.length / 2)
  if (sortedDescending.length % 2 === 1) return sortedDescending[middle]
  return (sortedDescending[middle - 1] + sortedDescending[middle]) / 2
}

/**
 * Where two of a character's turns swap places. This is the answer to "is the
 * feat worth it" — a GW Master turn out-damages a plain one until the AC gets
 * high enough that missing costs more than the +10 is worth.
 */
const findCrossovers = (rows: TurnRow[]): Crossover[] => {
  const crossovers: Crossover[] = []

  const characterIds = [...new Set(rows.map((row) => row.characterId))]

  for (const characterId of characterIds) {
    const turns = rows.filter((row) => row.characterId === characterId)

    for (let i = 0; i < turns.length; i++) {
      for (let j = i + 1; j < turns.length; j++) {
        const a = turns[i]
        const b = turns[j]

        for (let step = 0; step < AC_RANGE.length - 1; step++) {
          const before = a.curve[step] - b.curve[step]
          const after = a.curve[step + 1] - b.curve[step + 1]

          // Only a genuine swap counts; ties and parallel lines do not.
          if (before === 0 || before > 0 === after > 0) continue

          const fraction = before / (before - after)
          crossovers.push({
            characterName: a.characterName,
            fallsBehind: before > 0 ? a.turnName : b.turnName,
            overtakenBy: before > 0 ? b.turnName : a.turnName,
            ac: AC_RANGE[step] + fraction,
          })
        }
      }
    }
  }

  return crossovers.sort((a, b) => a.ac - b.ac)
}
