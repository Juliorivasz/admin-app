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
    <label className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`block rounded-full transition-colors ${checked ? 'bg-success' : 'bg-surface-2 border border-border'} ${isSm ? 'w-10 h-6' : 'w-14 h-8'}`}></div>
        <div className={`absolute top-1 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isSm ? 'left-1 w-4 h-4' : 'left-1 w-6 h-6'} ${checked ? (isSm ? 'translate-x-4' : 'translate-x-6') : 'translate-x-0'}`}></div>
      </div>
      {label && <span className={`font-semibold text-text ${isSm ? 'text-xs' : 'text-sm'}`}>{label}</span>}
    </label>
  );
}
