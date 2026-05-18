import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border bg-surface-2 px-4 py-2.5 text-sm text-text 
            placeholder:text-text-muted/50
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg
            transition-colors duration-200
            ${error 
              ? 'border-danger focus:border-danger focus:ring-danger/20' 
              : 'border-border focus:border-primary focus:ring-primary/20 hover:border-text-muted/30'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
