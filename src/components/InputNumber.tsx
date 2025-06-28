import { useState } from 'react'

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

  return (
    <input
      className={`input ${className}`}
      type="text"
      value={localValue}
      onChange={(e) => {
        const raw = e.target.value
        if (!regex?.test(raw)) return
        setLocalValue(raw)

        const trimmed = raw.trim()
        if (trimmed == '') {
          onChange?.(null)
        }

        const value = parseInt(trimmed, 10)
        if (!isNaN(value)) {
          onChange?.(value)
        }
      }}
    />
  )
}
