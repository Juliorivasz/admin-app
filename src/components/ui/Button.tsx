import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

/**
 * Button
 * ═══════════════════════════════════════════════════
 * Estilos según la nueva imagen:
 * - primary: Fondo sólido Indigo (#715DF2), sin brillos exagerados, texto blanco.
 * - secondary: Fondo transparente, borde suave (#2A2B3D), hover gris.
 * - Radio: rounded-lg (8px-10px).
 * ═══════════════════════════════════════════════════
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary/50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' ');

    const variants: Record<string, string> = {
      primary:   'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-transparent text-text border border-border hover:bg-surface-2',
      danger:    'bg-danger text-white hover:bg-danger/80',
      ghost:     'bg-transparent text-text-muted hover:text-text hover:bg-surface-2',
      warning:   'bg-warning/20 text-warning hover:bg-warning/30',
      success:   'bg-success/20 text-success hover:bg-success/30',
    };

    const sizes: Record<string, string> = {
      lg:   'text-[15px] px-5 py-2.5',
      md:   'text-[14px] px-4 py-2',
      sm:   'text-[13px] px-3 py-1.5',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 h-4 w-4 text-current shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
