import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        // Primary - warm dark background
        default:
          'bg-warm-900 text-white hover:bg-warm-800 active:scale-[0.98] shadow-soft hover:shadow-medium',
        // Accent - Notion blue for key CTAs
        accent:
          'bg-accent text-white hover:bg-accent-700 active:scale-[0.98] shadow-soft hover:shadow-medium',
        // Destructive
        destructive:
          'bg-danger text-white hover:bg-red-700 active:scale-[0.98]',
        // Outline / Secondary
        outline:
          'border border-warm-200 bg-transparent text-warm-900 hover:bg-warm-150 hover:border-warm-300 active:scale-[0.98]',
        // Secondary - subtle warm background
        secondary:
          'bg-warm-100 text-warm-900 hover:bg-warm-150 active:scale-[0.98]',
        // Ghost
        ghost:
          'text-warm-700 hover:bg-warm-150 hover:text-warm-900',
        // Danger ghost
        danger:
          'text-danger hover:bg-danger-bg',
        // Link - text only
        link:
          'text-accent underline-offset-4 hover:underline p-0 h-auto',
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
