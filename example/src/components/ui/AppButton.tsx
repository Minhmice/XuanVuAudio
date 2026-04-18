import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface AppButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-[#1000a9] hover:bg-primary-hover',
      secondary: 'bg-surface-high text-text-primary hover:bg-surface-highest',
      outline: 'bg-transparent border border-outline text-text-primary hover:bg-surface-low',
      ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-low',
      accent: 'bg-primary text-[#1000a9] hover:bg-primary-hover shadow-[0_0_20px_rgba(99,102,241,0.2)]'
    };

    const sizes = {
      sm: 'h-[32px] px-3 text-[10px]',
      md: 'h-[40px] px-4 text-[11px]',
      lg: 'h-[48px] px-6 text-[12px]'
    };

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-headline font-bold uppercase tracking-wider transition-all duration-200 rounded-default disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

AppButton.displayName = 'AppButton';
