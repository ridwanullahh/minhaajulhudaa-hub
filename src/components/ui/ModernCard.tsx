import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'muted' | 'accent';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

/**
 * ModernCard
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Clean card surface with restrained shadows and borders. No heavy
 * gradients or scale transforms. Uses the cohesive neutral palette
 * with an optional platform-accent tint.
 */
const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-lg border transition-colors duration-200';

    const variants = {
      default: 'bg-card border-border',
      elevated: 'bg-card border-border shadow-sm',
      muted: 'bg-secondary border-border',
      accent: 'bg-platform-accent-soft border-platform-accent-medium',
    };

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const hoverEffects = hover ? 'hover:border-platform-accent/40 hover:shadow-sm' : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], hoverEffects, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModernCard.displayName = 'ModernCard';

export { ModernCard };
