/**
 * Toggle — Midnight Fleet design system
 *
 * Interactive element using primary/success semantic colors.
 * Track: rounded-full, bg-success when on, bg-surface-2 + border when off.
 * Thumb: white rounded-full, 300ms ease transition.
 * Label: label-md (14px/500) text per DESIGN.md functional text spec.
 */

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ label, checked, onChange, disabled = false, size = 'md' }: ToggleProps) {
  const isSm = size === 'sm';

  return (
    <label
      className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        {/* Track */}
        <div
          className={`block rounded-full transition-colors duration-200 ${
            checked ? 'bg-success' : 'bg-surface-2 border border-border'
          } ${isSm ? 'w-10 h-6' : 'w-14 h-8'}`}
        />
        {/* Thumb */}
        <div
          className={`absolute top-1 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
            isSm ? 'left-1 w-4 h-4' : 'left-1 w-6 h-6'
          } ${checked ? (isSm ? 'translate-x-4' : 'translate-x-6') : 'translate-x-0'}`}
        />
      </div>
      {/* label-md: 14px / weight 500 — functional text */}
      {label && (
        <span
          className="font-medium text-text"
          style={{ fontSize: isSm ? '12px' : '14px', lineHeight: '20px' }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
