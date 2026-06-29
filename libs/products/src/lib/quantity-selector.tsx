import { Minus, Plus } from 'lucide-react'
import { Button, cn } from '@react-monorepo/shared-ui'

interface QuantitySelectorProps {
  value: number
  onChange: (qty: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({ value, onChange, min = 1, max, className }: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1)
  }
  const increment = () => {
    if (max === undefined || value < max) onChange(value + 1)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <span
        className="w-10 text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={increment}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
