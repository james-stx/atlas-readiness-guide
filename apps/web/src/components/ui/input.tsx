import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:border-accent-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
