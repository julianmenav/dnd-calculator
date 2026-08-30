import { useTranslation } from 'react-i18next'
import { CharacterProvider } from '../context/CharacterContext'
import type { Character } from '../models'
import { useScenarioStore } from '../store/scenarioStore'
import TurnComponent from './Turn'
import { ABILITIES } from '../models'
import X from '../icons/X'
import Plus from '../icons/Plus'
import Squares from '../icons/Squares'
import InputNumber from './InputNumber'
import Copy from '../icons/Copy'
import { cn } from '../lib/utils'
import {
  btnDashed,
  buildAccent,
  field,
  iconBtn,
  iconBtnDanger,
  microLabel,
} from '../lib/ui'

export default function CharacterComponent({
  character,
  index,
}: {
  character: Character
  index: number
}) {
  const { t } = useTranslation()
  const { updateCharacter, copyCharacter, removeCharacter, addTurn } =
    useScenarioStore((state) => state.actions)

  const accent = buildAccent(index)

  return (
    <CharacterProvider value={character}>
      <section
        className={cn(
          'border-rule bg-panel rounded-panel flex flex-col overflow-hidden border',
          character.compactMode ? 'w-[300px]' : 'min-w-[280px]'
        )}
      >
        <div className={cn('h-[3px] shrink-0', accent)} />

        <div className="border-rule flex flex-col gap-2.5 border-b p-3">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 shrink-0 rounded-full', accent)} />

            <input
              className={cn(field, 'min-w-0 flex-grow font-semibold')}
              placeholder={t('character.namePlaceholder')}
              value={character.name}
              onChange={(e) =>
                updateCharacter(character.id, { name: e.target.value })
              }
            />

            <label className="border-line bg-panel rounded-field flex h-8 shrink-0 items-center gap-1 border pr-1 pl-2">
              <span className={microLabel}>{t('character.level')}</span>
              <InputNumber
                className="text-ink h-6 w-8 border-transparent bg-transparent text-center font-semibold hover:border-transparent"
                value={character.lvl}
                onChange={(value) =>
                  updateCharacter(character.id, { lvl: value ?? 0 })
                }
                regex={/^$|^\d{1,2}$/}
              />
            </label>

            <button
              className={cn(
                iconBtn,
                character.compactMode &&
                  'border-accent bg-accent/12 text-accent hover:border-accent hover:text-accent'
              )}
              title={
                character.compactMode
                  ? t('character.expand')
                  : t('character.compact')
              }
              onClick={() =>
                updateCharacter(character.id, {
                  compactMode: !character.compactMode,
                })
              }
            >
              <Squares />
            </button>

            <button
              className={iconBtn}
              title={t('character.duplicate')}
              onClick={() => copyCharacter(character.id)}
            >
              <Copy />
            </button>

            <button
              className={iconBtnDanger}
              title={t('character.remove')}
              onClick={() => removeCharacter(character.id)}
            >
              <X />
            </button>
          </div>

          {!character.compactMode && (
            <div className="grid max-w-[430px] grid-cols-6 gap-1">
              {ABILITIES.map((ability) => (
                <label
                  key={ability}
                  className="border-rule bg-card rounded-field flex flex-col items-center gap-1 border py-1"
                  title={t(`abilities.${ability}`)}
                >
                  <span className={microLabel}>
                    {t(`abilitiesShort.${ability}`)}
                  </span>
                  <InputNumber
                    className="text-ink h-5 w-full border-transparent bg-transparent px-0 text-center text-[13px] font-bold hover:border-transparent"
                    value={character.abilities[ability]}
                    regex={/^$|^-?$|^-?[0-9]$/}
                    onChange={(value) => {
                      updateCharacter(character.id, {
                        abilities: {
                          ...character.abilities,
                          [ability]: value,
                        },
                      })
                    }}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-col gap-3 p-3">
          <div
            className={cn(
              'flex flex-grow gap-3',
              character.compactMode
                ? 'flex-col items-stretch'
                : 'flex-row justify-center'
            )}
          >
            {character.turns.map((turn) => (
              <TurnComponent key={turn.id} turn={turn} />
            ))}
          </div>

          {!character.compactMode && (
            <button
              className={cn(btnDashed, 'w-full')}
              onClick={() => addTurn(character.id)}
            >
              <Plus />
              {t('character.addTurn')}
            </button>
          )}
        </div>
      </section>
    </CharacterProvider>
  )
}
