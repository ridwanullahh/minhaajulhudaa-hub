
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', padding = 'md', hover = true, children, ...props }, ref) => {
    const baseStyles = "relative rounded-2xl transition-all duration-300 ease-out";
    
    const variants = {
      default: "bg-white shadow-lg border border-amber-100",
      elevated: "bg-white shadow-2xl border-0",
      glass: "bg-white/70 backdrop-blur-md border border-white/20 shadow-xl",
      gradient: "bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 border border-amber-200/50 shadow-lg"
    };
    
    const paddings = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10"
    };
    
    const hoverEffects = hover 
      ? "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1" 
      : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverEffects,
          className
        )}
        {...props}
      >
        {/* Subtle animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-200/0 via-amber-300/30 to-amber-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

ModernCard.displayName = "ModernCard";

export { ModernCard };
