import Icon from './Icon'

export default function QtyStepper({ value, onChange, max = 99, label = 'item', allowZero = false, size }) {
  const min = allowZero ? 0 : 1
  return (
    <div className={`qty ${size === 'lg' ? 'qty--lg' : ''}`} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity" disabled={value <= min}>
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity" disabled={value >= max}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}
