/**
 * Shared class recipes for the console styling.
 * Kept as literal strings so Tailwind's scanner picks them up.
 */

export const microLabel =
  'text-[8px] leading-none font-medium uppercase tracking-[0.16em] text-ink-3'

export const sectionLabel =
  'text-[10px] leading-none font-semibold uppercase tracking-[0.18em] text-ink-2'

const fieldBase =
  'rounded-field border border-line bg-panel text-ink outline-none transition-colors placeholder:text-ink-4 hover:border-edge focus:border-accent focus:ring-[3px] focus:ring-accent/10'

export const field = `h-8 px-2.5 text-[13px] ${fieldBase}`
export const fieldSm = `h-7 px-2 text-[12px] ${fieldBase}`
export const fieldXs = `h-6 px-1.5 text-center font-mono text-[12px] ${fieldBase}`

export const btnPrimary =
  'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-field border border-accent bg-accent px-3 text-[12px] font-semibold text-accent-ink transition-colors hover:bg-accent/85'

export const btnGhost =
  'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-field border border-edge bg-raised px-3 text-[12px] font-medium text-ink-2 transition-colors hover:border-ink-4 hover:text-ink'

export const btnGhostSm =
  'inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-field border border-edge bg-raised px-2.5 text-[11px] font-medium text-ink-2 transition-colors hover:border-ink-4 hover:text-ink'

export const btnDashed =
  'inline-flex h-[30px] cursor-pointer items-center justify-center gap-1.5 rounded-field border border-dashed border-edge bg-transparent px-3 text-[11px] font-medium tracking-[0.06em] text-ink-3 transition-colors hover:border-ink-4 hover:text-ink-2'

export const iconBtn =
  'inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-field border border-edge bg-raised p-0 text-ink-2 transition-colors hover:border-ink-4 hover:text-ink'

export const iconBtnSm =
  'inline-flex h-[19px] w-[19px] shrink-0 cursor-pointer items-center justify-center rounded-field border border-edge bg-transparent p-0 text-ink-3 transition-colors hover:border-ink-4 hover:text-ink'

export const iconBtnDanger =
  'inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-field border border-loss/30 bg-loss/10 p-0 text-loss transition-colors hover:bg-loss/20'

export const iconBtnDangerSm =
  'inline-flex h-[19px] w-[19px] shrink-0 cursor-pointer items-center justify-center rounded-field border border-loss/30 bg-loss/10 p-0 text-loss transition-colors hover:bg-loss/20'

export const iconBtnGain =
  'inline-flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-field border border-gain/30 bg-gain/10 p-0 text-gain transition-colors hover:bg-gain/20'

export const selectField =
  'w-full cursor-pointer appearance-none rounded-field border border-edge bg-card py-[5px] pl-2 pr-6 text-[11px] font-medium text-ink outline-none transition-colors hover:border-ink-4 focus:border-accent'

/** One hue per character, cycled by position in the scenario. */
export const BUILD_ACCENTS = [
  'bg-build-1',
  'bg-build-2',
  'bg-build-3',
  'bg-build-4',
  'bg-build-5',
  'bg-build-6',
] as const

export const buildAccent = (index: number) =>
  BUILD_ACCENTS[index % BUILD_ACCENTS.length]
