import {type HTMLAttributes, forwardRef} from 'react';
import {cn} from '../../lib/utils';

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({className, defaultValue, onValueChange, children, ...props}, ref) => {
    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {children}
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({className, children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        className={cn('inline-flex h-10 items-center justify-center rounded-[6px] bg-white/5 p-1 text-terminal', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({className, value, children, ...props}, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={false}
        data-value={value}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[4px] px-3 py-1.5 font-mono text-label text-regolith/70 transition-all focus:outline-none focus:ring-2 focus:ring-terminal focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:bg-white/5',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({className, value, children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-value={value}
        className={cn('animate-fade-in', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';