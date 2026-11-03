import {type InputHTMLAttributes, forwardRef} from 'react';
import {cn} from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({className, label, error, id, ...props}, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block font-mono text-label text-regolith/60 uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[4px] bg-white/[0.04] px-4 py-3.5 text-body text-white ring-1 ring-white/15 outline-none placeholder:text-regolith/40 focus:ring-terminal transition-colors',
            error && 'ring-red-400/50 focus:ring-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-red-400 font-mono text-[0.625rem]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';