import { persist } from 'zustand/middleware'
import type { Scenario, Character, Turn, Attack, Dice } from '../models'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'

interface ScenarioState {
  scenario: Scenario
  actions: {
    updateEnemyAc: (newAc: number) => void

    addCharacter: (character?: Character) => void
    addTurn: (characterId: string, turn?: Turn) => void
    addAttack: (characterId: string, turnId: string, dices: Dice[]) => void

    updateCharacter: (
      characterId: string,
      updatedCharacter: Partial<Character>
    ) => void
    updateTurn: (
      characterId: string,
      turnId: string,
      updatedTurn: Partial<Turn>
    ) => void
    updateAttack: (
      characterId: string,
      turnId: string,
      attackId: string,
      updatedAttack: Partial<Attack>
    ) => void

    removeCharacter: (characterId: string) => void
    removeTurn: (characterId: string, turnId: string) => void
    removeAttack: (
      characterId: string,
      turnId: string,
      attackId: string
    ) => void

    copyCharacter: (characterId: string) => void
    copyTurn: (characterId: string, turnId: string) => void
  }
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set) => ({
      scenario: {
        enemyAc: 10,
        characters: [],
      },
      actions: {
        updateEnemyAc: (newAc: number) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              enemyAc: newAc,
            },
          })),

        addCharacter: (character?: Character) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: [
                ...state.scenario.characters,
                createCharacter(character),
              ],
            },
          })),

        addTurn: (characterId: string, turn?: Turn) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.map((character) =>
                character.id === characterId
                  ? {
                      ...character,
                      turns: [...character.turns, createTurn(turn)],
                    }
                  : character
              ),
            },
          })),

        addAttack: (characterId: string, turnId: string, dices: Dice[]) =>
          set((state) => {
            if (dices.length === 0) return state
            return {
              scenario: {
                ...state.scenario,
                characters: state.scenario.characters.map((character) =>
                  character.id === characterId
                    ? {
                        ...character,
                        turns: character.turns.map((turn) =>
                          turn.id === turnId
                            ? {
                                ...turn,
                                attacks: [...turn.attacks, createAttack(dices)],
                              }
                            : turn
                        ),
                      }
                    : character
                ),
              },
            }
          }),

        updateCharacter: (
          characterId: string,
          updatedCharacter: Partial<Character>
        ) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.map((character) =>
                character.id === characterId
                  ? { ...character, ...updatedCharacter }
                  : character
              ),
            },
          })),

        updateTurn: (
          characterId: string,
          turnId: string,
          updatedTurn: Partial<Turn>
        ) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.map((character) =>
                character.id === characterId
                  ? {
                      ...character,
                      turns: character.turns.map((turn) =>
                        turn.id === turnId ? { ...turn, ...updatedTurn } : turn
                      ),
                    }
                  : character
              ),
            },
          })),

        updateAttack: (
          characterId: string,
          turnId: string,
          attackId: string,
          updatedAttack: Partial<Attack>
        ) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.map((character) =>
                character.id === characterId
                  ? {
                      ...character,
                      turns: character.turns.map((turn) =>
                        turn.id === turnId
                          ? {
                              ...turn,
                              attacks: turn.attacks.map((attack) =>
                                attack.id === attackId
                                  ? { ...attack, ...updatedAttack }
                                  : attack
                              ),
                            }
                          : turn
                      ),
                    }
                  : character
              ),
            },
          })),

        removeCharacter: (characterId: string) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.filter(
                (character) => character.id !== characterId
              ),
            },
          })),
        removeTurn: (characterId: string, turnId: string) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.map((character) =>
                character.id === characterId
                  ? {
                      ...character,
                      turns: character.turns.filter(
                        (turn) => turn.id !== turnId
                      ),
                    }
                  : character
              ),
            },
          })),

        removeAttack: (characterId: string, turnId: string, attackId: string) =>
          set((state) => ({
            scenario: {
              ...state.scenario,
              characters: state.scenario.characters.map((character) =>
                character.id === characterId
                  ? {
                      ...character,
                      turns: character.turns.map((turn) =>
                        turn.id === turnId
                          ? {
                              ...turn,
                              attacks: turn.attacks.filter(
                                (attack) => attack.id !== attackId
                              ),
                            }
                          : turn
                      ),
                    }
                  : character
              ),
            },
          })),
        copyCharacter: (characterId: string) =>
          set((state) => {
            const index = state.scenario.characters.findIndex(
              (character) => character.id === characterId
            )
            if (index === -1) return state
            const characterToCopy = state.scenario.characters[index]
            const newCharacter = createCharacter(characterToCopy)
            const newCharacters = [
              ...state.scenario.characters.slice(0, index + 1),
              newCharacter,
              ...state.scenario.characters.slice(index + 1),
            ]
            return {
              scenario: {
                ...state.scenario,
                characters: newCharacters,
              },
            }
          }),

        copyTurn: (characterId: string, turnId: string) =>
          set((state) => {
            const characterIndex = state.scenario.characters.findIndex(
              (character) => character.id === characterId
            )
            if (characterIndex === -1) return state
            const character = state.scenario.characters[characterIndex]
            const turnIndex = character.turns.findIndex(
              (turn) => turn.id === turnId
            )
            if (turnIndex === -1) return state
            const turnToCopy = character.turns[turnIndex]
            const newTurn = createTurn(turnToCopy)
            const newTurns = [
              ...character.turns.slice(0, turnIndex + 1),
              newTurn,
              ...character.turns.slice(turnIndex + 1),
            ]
            const newCharacters = [...state.scenario.characters]
            newCharacters[characterIndex] = {
              ...character,
              turns: newTurns,
            }
            return {
              scenario: {
                ...state.scenario,
                characters: newCharacters,
              },
            }
          }),
      },
    }),
    {
      name: 'dnd-scenario-storage',
      partialize: (state) => ({ scenario: state.scenario }),
    }
  )
)

// I think I will create new objects empty most of the time
// but just in case I put an optional field to "clone" then if needed.

const createCharacter = (character?: Character): Character => {
  return {
    id: uuidv4(),
    name: character?.name || '',
    lvl: character?.lvl || 1,
    abilities: {
      Strength: character?.abilities?.Strength || 0,
      Dexterity: character?.abilities?.Dexterity || 0,
      Constitution: character?.abilities?.Constitution || 0,
      Intelligence: character?.abilities?.Intelligence || 0,
      Wisdom: character?.abilities?.Wisdom || 0,
      Charisma: character?.abilities?.Charisma || 0,
    },
    turns: character?.turns || [],
    compactMode: character?.compactMode || false,
  }
}

const createTurn = (turn?: Turn): Turn => {
  return {
    id: uuidv4(),
    name: turn?.name || '',
    enemyAc: turn?.enemyAc,
    attacks: turn?.attacks || [],
  }
}

const createAttack = (dices: Dice[]): Attack => {
  return {
    id: uuidv4(),
    dices: dices,
    feats: [],
    attackBonusAbility: undefined,
    damageBonusAbility: undefined,
  }
}
