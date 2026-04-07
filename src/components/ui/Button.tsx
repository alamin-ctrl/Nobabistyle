import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-bold uppercase tracking-[0.15em] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          {
            'bg-black text-white hover:bg-gold-600 hover:text-white shadow-lg hover:shadow-gold-500/20': variant === 'default',
            'border border-gray-200 bg-white text-gray-900 hover:border-gold-500 hover:text-gold-600': variant === 'outline',
            'hover:bg-gold-50 hover:text-gold-700': variant === 'ghost',
            'text-gray-900 underline-offset-8 hover:underline hover:text-gold-600': variant === 'link',
            'h-12 px-8': size === 'default',
            'h-10 px-6': size === 'sm',
            'h-14 px-10 text-sm': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
