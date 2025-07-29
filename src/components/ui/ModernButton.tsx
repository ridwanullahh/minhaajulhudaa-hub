
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
    
    const variants = {
      primary: "bg-platform-primary text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-amber-500 border-2 border-transparent",
      secondary: "bg-platform-secondary text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-amber-400 border-2 border-transparent",
      accent: "bg-platform-accent text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-blue-500 border-2 border-transparent",
      outline: "border-2 border-platform-primary text-platform-primary hover:bg-platform-primary hover:text-white focus:ring-amber-500 hover:scale-[1.02]",
      ghost: "text-platform-primary hover:bg-platform-primary hover:bg-opacity-10 focus:ring-amber-500 hover:scale-[1.02]"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl",
      xl: "px-10 py-5 text-xl rounded-2xl"
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Animated background overlay */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        
        <span className="relative flex items-center gap-2">
          {leftIcon && !isLoading && (
            <span className="transition-transform group-hover:scale-110">
              {leftIcon}
            </span>
          )}
          
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : null}
          
          <span className="transition-all duration-300 group-hover:tracking-wide">
            {children}
          </span>
          
          {rightIcon && !isLoading && (
            <span className="transition-transform group-hover:scale-110 group-hover:translate-x-1">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

ModernButton.displayName = "ModernButton";

export { ModernButton };
