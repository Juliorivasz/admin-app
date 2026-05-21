import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input — Midnight Fleet design system
 *
 * DESIGN.md spec:
 *   - Label above input with 6px gap (gap-label-input)
 *   - Background: #22263A (surface-2)
 *   - Border: 1px #2E3250 (border)
 *   - Radius: 12px (rounded-xl)
 *   - Padding: 16px horizontal / 10px vertical
 *   - Hover: border → #94A3B8 @ 30% opacity
 *   - Focus: border #6C63FF + 2px ring @ 20% transparency + 2px offset
 *   - Error: border + text → #EF4444
 *   - Error text: 12px, 2px margin-top
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    // Use provided id or generate a stable one for label association
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col" style={{ gap: '6px' }}>  {/* gap-label-input: 6px */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full rounded-xl border bg-surface-2 text-text font-normal
            placeholder:text-text-muted/50
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg
            ${error
              ? 'border-danger text-danger focus:border-danger focus:ring-danger/20'
              : 'border-border hover:border-text-muted/30 focus:border-primary focus:ring-primary/20'
            }
            ${className}
          `}
          style={{ padding: '10px 16px', fontSize: '14px' }}  /* 10px v / 16px h — DESIGN.md */
          {...props}
        />
        {error && (
          <span
            className="text-danger font-normal"
            style={{ fontSize: '12px', lineHeight: '16px', marginTop: '2px' }}  /* error-text + margin-error */
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
