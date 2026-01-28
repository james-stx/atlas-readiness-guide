import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - solid dark background
        default:
          'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] shadow-soft hover:shadow-medium',
        // Accent - teal for key CTAs
        accent:
          'bg-accent-600 text-white hover:bg-accent-700 active:scale-[0.98] shadow-soft hover:shadow-medium',
        // Destructive
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
        // Outline - bordered
        outline:
          'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98]',
        // Secondary - subtle background
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-[0.98]',
        // Ghost - no background
        ghost:
          'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        // Link - text only
        link:
          'text-accent-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-5 py-2.5 rounded-lg',
        sm: 'h-9 px-4 py-2 rounded-md text-sm',
        lg: 'h-12 px-8 py-3 rounded-lg text-base',
        xl: 'h-14 px-10 py-4 rounded-xl text-base font-semibold',
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
