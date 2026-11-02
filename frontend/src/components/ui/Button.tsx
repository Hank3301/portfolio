import {type ButtonHTMLAttributes, forwardRef} from 'react';
import {cn} from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant = 'default', size = 'md', loading, disabled, children, ...props}, ref) => {
    const base = 'inline-flex items-center justify-center font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-terminal focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      default: 'bg-terminal text-void hover:bg-white',
      outline: 'border border-white/20 bg-transparent hover:bg-white/5',
      ghost: 'bg-transparent hover:bg-white/5',
      destructive: 'border border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-[0.625rem]',
      md: 'px-4 py-2 text-label',
      lg: 'px-6 py-3 text-body',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';