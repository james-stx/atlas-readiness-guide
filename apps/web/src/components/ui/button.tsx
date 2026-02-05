import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        // Primary - dark background (for non-accent CTAs)
        default:
          'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] shadow-soft hover:shadow-medium',
        // Accent - teal for key CTAs (V2 primary)
        accent:
          'bg-accent-600 text-white hover:bg-accent-700 active:scale-[0.98] shadow-soft hover:shadow-medium',
        // Destructive
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
        // Outline / Secondary (V2 secondary)
        outline:
          'border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-secondary)] active:scale-[0.98]',
        // Secondary - subtle background
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-[0.98]',
        // Ghost (V2 ghost)
        ghost:
          'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
        // Danger ghost
        danger:
          'text-danger hover:bg-danger-bg',
        // Link - text only
        link:
          'text-accent-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        // V2 specs
        default: 'h-10 px-5 rounded-lg',       // 40px
        sm: 'h-8 px-3 rounded-md text-caption', // 32px - ghost/danger size
        lg: 'h-12 px-8 rounded-lg text-base',   // 48px - hero CTAs
        xl: 'h-14 px-10 rounded-xl text-base font-semibold',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
