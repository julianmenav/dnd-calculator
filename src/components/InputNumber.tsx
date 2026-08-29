import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { fieldSm } from '../lib/ui'

export default function InputNumber({
  value,
  className,
  onChange,
  regex,
}: {
  value: number | null
  className?: string
  onChange?: (value: number | null) => void
  regex?: RegExp
}) {
  const [localValue, setLocalValue] = useState(value?.toString() ?? '')

  /**
   * What we last handed to onChange. Anything else arriving in `value` came
   * from outside (a stepper, an undo, a copied character), so the field has
   * to catch up — while a half-typed "-" that we never emitted is left alone.
   */
  const emitted = useRef(value)

  useEffect(() => {
    if (value === emitted.current) return
    emitted.current = value
    setLocalValue(value?.toString() ?? '')
  }, [value])

  return (
    <input
      className={cn(fieldSm, 'font-mono', className)}
      type="text"
      inputMode="numeric"
      value={localValue}
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
