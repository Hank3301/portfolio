import {type SelectHTMLAttributes, forwardRef} from 'react';
import {cn} from '../../lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {value: string; label: string}[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({className, label, error, options, id, ...props}, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block font-mono text-label text-regolith/60 uppercase">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-[4px] bg-white/[0.04] px-4 py-3.5 text-body text-white ring-1 ring-white/15 outline-none focus:ring-terminal transition-colors appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2300ff88%27 stroke-width=%272%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E")] bg-[right_12px_center] bg-no-repeat pr-10',
            error && 'ring-red-400/50 focus:ring-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-red-400 font-mono text-[0.625rem]">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';