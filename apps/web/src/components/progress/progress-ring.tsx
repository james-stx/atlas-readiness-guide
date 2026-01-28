'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const sizeConfig = {
  sm: {
    width: 24,
    height: 24,
    strokeWidth: 3,
    radius: 9,
    fontSize: 'text-[8px]',
  },
  md: {
    width: 48,
    height: 48,
    strokeWidth: 4,
    radius: 20,
    fontSize: 'text-base',
  },
  lg: {
    width: 96,
    height: 96,
    strokeWidth: 6,
    radius: 42,
    fontSize: 'text-2xl',
  },
};

export function ProgressRing({
  value,
  size = 'md',
  className,
  showLabel = true,
}: ProgressRingProps) {
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(value, 0), 100) / 100);
  const center = config.width / 2;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Assessment progress: ${value} percent complete`}
    >
      <svg
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="transform -rotate-90"
      >
        {/* Track (background circle) */}
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="#E7E5E4"
          strokeWidth={config.strokeWidth}
        />
        {/* Progress (foreground arc) */}
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="#0D9488"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
      {/* Center text */}
      {showLabel && (
        <span
          className={cn(
            'absolute font-bold text-neutral-900',
            config.fontSize
          )}
        >
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
