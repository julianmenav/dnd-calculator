import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { fieldSm } from '../lib/ui'

export default function InputNumber({
  value,
  className,
  title,
  onChange,
  regex,
  format,
}: {
  value: number | null
  className?: string
  title?: string
  onChange?: (value: number | null) => void
  regex?: RegExp
  /** How a settled value is displayed (e.g. signed). Typing stays raw. */
  format?: (value: number) => string
}) {
  const toText = (v: number | null) =>
    v === null ? '' : format ? format(v) : v.toString()

  const [localValue, setLocalValue] = useState(() => toText(value))

  /**
   * What we last handed to onChange. Anything else arriving in `value` came
   * from outside (a stepper, an undo, a copied character), so the field has
   * to catch up — while a half-typed "-" that we never emitted is left alone.
   */
  const emitted = useRef(value)

  useEffect(() => {
    if (value === emitted.current) return
    emitted.current = value
    setLocalValue(value === null ? '' : format ? format(value) : String(value))
  }, [value, format])

  return (
    <input
      className={cn(fieldSm, 'font-mono', className)}
      type="text"
      title={title}
      inputMode="numeric"
      value={localValue}
      // Settle back to the formatted value, clearing half-typed "-" or "+".
      onBlur={() => setLocalValue(toText(emitted.current))}
      onChange={(e) => {
        const raw = e.target.value
        if (!regex?.test(raw)) return
        setLocalValue(raw)

        const trimmed = raw.trim()
        if (trimmed == '') {
          emitted.current = null
          onChange?.(null)
        }

        const value = parseInt(trimmed, 10)
        if (!isNaN(value)) {
          emitted.current = value
          onChange?.(value)
        }
      }}
    />
  )
}
