import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AtlasLogoProps {
  /** 'blue' = blue background logo; 'dark' = dark background logo */
  variant?: 'blue' | 'dark';
  /** Pixel size (width = height). Defaults to 32. */
  size?: number;
  className?: string;
}

export function AtlasLogo({ variant = 'blue', size = 32, className }: AtlasLogoProps) {
  return (
    <Image
      src={variant === 'blue' ? '/logo-blue.png' : '/logo-dark.png'}
      alt="Atlas"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      style={{ width: size, height: size }}
      priority
    />
  );
}
