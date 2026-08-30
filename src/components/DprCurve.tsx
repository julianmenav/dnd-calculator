import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAnalysis } from '../context/AnalysisContext'
import { useScenario } from '../context/ScenarioContext'
import { AC_MAX, AC_MIN, AC_RANGE, type TurnRow } from '../lib/analysis'
import { buildHex, sectionLabel, turnDash } from '../lib/ui'
import { CROSSOVER_LIMIT } from './Crossovers'

const WIDTH = 820
const HEIGHT = 300
const LEFT = 42
const RIGHT = 700
const TOP = 14
const BOTTOM = 268

const STEP = (RIGHT - LEFT) / (AC_RANGE.length - 1)
const xFor = (acIndex: number) => LEFT + acIndex * STEP
/** Same scale, but for a crossing that lands between two whole ACs. */
const xForAc = (ac: number) => LEFT + (ac - AC_MIN) * STEP

/** Round the axis top up to something with readable labels. */
const niceCeiling = (value: number) => {
  if (value <= 0) return 10
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500]
  const target = value / 5
  const step = steps.find((candidate) => candidate >= target) ?? 1000
  return step * 5
}

export default function DprCurve() {
  const { t } = useTranslation()
  const analysis = useAnalysis()
  const scenario = useScenario()
  const svg = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const ceiling = niceCeiling(
    Math.max(...analysis.rows.flatMap((row) => row.curve), 0)
  )
  const gridStep = ceiling / 5
  const yFor = (value: number) => BOTTOM - (value / ceiling) * (BOTTOM - TOP)

  const track = (clientX: number) => {
    const box = svg.current?.getBoundingClientRect()
    if (!box) return
    const x = (clientX - box.left) * (WIDTH / box.width)
    const index = Math.round((x - LEFT) / STEP)
    setHovered(Math.min(AC_RANGE.length - 1, Math.max(0, index)))
  }

  return (
    <div className="border-rule bg-panel rounded-panel flex min-w-0 flex-col gap-2 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className={sectionLabel}>{t('analysis.curveTitle')}</span>
        <span className="text-ink-4 font-mono text-[10px]">
          {t('analysis.acRange', { min: AC_MIN, max: AC_MAX })}
        </span>
      </div>

      <svg
        ref={svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-auto w-full"
        onMouseMove={(event) => track(event.clientX)}
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 6 }, (_, index) => {
          const value = index * gridStep
          return (
            <g key={value}>
              <line
                x1={LEFT}
                y1={yFor(value)}
                x2={RIGHT}
                y2={yFor(value)}
                stroke={index === 0 ? '#2b3243' : '#1a1f2c'}
              />
              <text
                x={LEFT - 8}
                y={yFor(value) + 3.5}
                textAnchor="end"
                fill="#4a5265"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
              >
                {value}
              </text>
            </g>
          )
        })}

        {/* Where the scenario is currently pointed. */}
        {scenario.enemyAc >= AC_MIN && scenario.enemyAc <= AC_MAX && (
          <line
            x1={xForAc(scenario.enemyAc)}
            y1={TOP}
            x2={xForAc(scenario.enemyAc)}
            y2={BOTTOM}
            stroke="#ef9d32"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        )}

        {AC_RANGE.map((ac, index) => {
          const current = ac === scenario.enemyAc
          return (
            <text
              key={ac}
              x={xFor(index)}
              y={BOTTOM + 18}
              textAnchor="middle"
              fill={current ? '#ef9d32' : '#4a5265'}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="10"
              fontWeight={current ? 700 : 400}
            >
              {ac}
            </text>
          )
        })}
        <text
          x={(LEFT + RIGHT) / 2}
          y={HEIGHT - 2}
          textAnchor="middle"
          fill="#616a7e"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="9"
          fontWeight="500"
          letterSpacing="1.6"
        >
          {t('analysis.enemyAcAxis')}
        </text>

        {analysis.rows.map((row) => (
          <polyline
            key={row.turnId}
            fill="none"
            stroke={buildHex(row.characterIndex)}
            strokeWidth={row.rank === 1 ? 2.6 : 2}
            strokeDasharray={turnDash(row.turnIndex) || undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={row.curve
              .map((value, index) => `${xFor(index)},${yFor(value)}`)
              .join(' ')}
          />
        ))}

        {/* Where each turn is actually being scored, override included. */}
        {analysis.rows.map((row) => {
          const index = row.effectiveAc - AC_MIN
          if (index < 0 || index >= AC_RANGE.length) return null
          return (
            <circle
              key={row.turnId}
              cx={xFor(index)}
              cy={yFor(row.curve[index])}
              r={row.rank === 1 ? 4.2 : 3.4}
              fill={buildHex(row.characterIndex)}
              stroke="#12151f"
              strokeWidth="2"
            />
          )
        })}

        {/* Break-even points, ringed rather than filled so they read as
            annotation and not as another series. */}
        {analysis.crossovers.slice(0, CROSSOVER_LIMIT).map((crossover, i) => (
          <g key={`${crossover.fallsBehind}-${i}`}>
            <circle
              cx={xForAc(crossover.ac)}
              cy={yFor(crossover.damage)}
              r="6.5"
              fill="none"
              stroke="#98a1b5"
              strokeWidth="1.4"
            />
            <text
              x={xForAc(crossover.ac)}
              y={yFor(crossover.damage) - 11}
              textAnchor="middle"
              fill="#98a1b5"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9"
              fontWeight="500"
            >
              {crossover.ac.toFixed(1)}
            </text>
          </g>
        ))}

        <DirectLabels rows={analysis.rows} yFor={yFor} />

        {hovered !== null && (
          <Crosshair
            index={hovered}
            rows={analysis.rows}
            yFor={yFor}
            ceiling={ceiling}
          />
        )}

        <rect
          x={LEFT}
          y={TOP}
          width={RIGHT - LEFT}
          height={BOTTOM - TOP}
          fill="transparent"
        />
      </svg>
    </div>
  )
}

/**
 * Name the three highest lines at the right edge. Any more and the labels
 * collide in the pack at the bottom; the ranking beside the chart names the
 * rest.
 */
function DirectLabels({
  rows,
  yFor,
}: {
  rows: TurnRow[]
  yFor: (value: number) => number
}) {
  const { t } = useTranslation()
  const last = AC_RANGE.length - 1
  const labelled = [...rows]
    .sort((a, b) => b.curve[last] - a.curve[last])
    .slice(0, 3)
    .map((row) => ({ row, y: yFor(row.curve[last]) }))
    .sort((a, b) => a.y - b.y)

  // Push apart anything closer than a line of text.
  for (let i = 1; i < labelled.length; i++) {
    const gap = labelled[i].y - labelled[i - 1].y
    if (gap < 13) labelled[i].y = labelled[i - 1].y + 13
  }

  return (
    <g>
      {labelled.map(({ row, y }) => (
        <g key={row.turnId}>
          <line
            x1={RIGHT + 2}
            y1={yFor(row.curve[last])}
            x2={RIGHT + 12}
            y2={y}
            stroke={buildHex(row.characterIndex)}
            strokeWidth="1.5"
          />
          <text
            x={RIGHT + 16}
            y={y + 3.5}
            fill="#98a1b5"
            fontFamily="'Space Grotesk', sans-serif"
            fontSize="10"
            fontWeight="500"
          >
            {truncate(row.turnName || t('turn.unnamed'), 15)}
          </text>
        </g>
      ))}
    </g>
  )
}

function Crosshair({
  index,
  rows,
  yFor,
  ceiling,
}: {
  index: number
  rows: TurnRow[]
  yFor: (value: number) => number
  ceiling: number
}) {
  const { t } = useTranslation()
  const x = xFor(index)
  const listed = [...rows]
    .sort((a, b) => b.curve[index] - a.curve[index])
    .slice(0, 8)

  const width = 176
  const height = 26 + listed.length * 14
  const flip = x + 14 + width > WIDTH - 4
  const boxX = flip ? x - 14 - width : x + 14
  const boxY = Math.min(BOTTOM - height, Math.max(TOP, yFor(ceiling / 2)))

  return (
    <g pointerEvents="none">
      <line x1={x} y1={TOP} x2={x} y2={BOTTOM} stroke="#98a1b5" opacity="0.4" />

      {rows.map((row) => (
        <circle
          key={row.turnId}
          cx={x}
          cy={yFor(row.curve[index])}
          r="3"
          fill={buildHex(row.characterIndex)}
          stroke="#12151f"
          strokeWidth="1.5"
        />
      ))}

      <rect
        x={boxX}
        y={boxY}
        width={width}
        height={height}
        rx="4"
        fill="#171b27"
        stroke="#2b3243"
      />
      <text
        x={boxX + 10}
        y={boxY + 15}
        fill="#98a1b5"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="9"
        fontWeight="600"
        letterSpacing="1.4"
      >
        {t('analysis.enemyAcAt', { ac: AC_RANGE[index] })}
      </text>

      {listed.map((row, order) => {
        const y = boxY + 30 + order * 14
        return (
          <g key={row.turnId}>
            <rect
              x={boxX + 10}
              y={y - 5}
              width="6"
              height="6"
              rx="1"
              fill={buildHex(row.characterIndex)}
            />
            <text
              x={boxX + 22}
              y={y}
              fill="#98a1b5"
              fontFamily="'Space Grotesk', sans-serif"
              fontSize="10"
            >
              {truncate(row.turnName || t('turn.unnamed'), 16)}
            </text>
            <text
              x={boxX + width - 10}
              y={y}
              textAnchor="end"
              fill="#e9ecf3"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="10"
            >
              {row.curve[index].toFixed(2)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text
