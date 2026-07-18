import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold rounded transition-all duration-200 outline-none focus:ring-1 focus:ring-[var(--accent-color)]/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/85 text-black border border-[var(--accent-color)]/20 shadow-md',
    secondary: 'bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border-main)]',
    danger: 'bg-rose-950/20 hover:bg-rose-900/35 text-rose-300 border border-rose-900/40',
    success: 'bg-emerald-950/20 hover:bg-emerald-900/35 text-emerald-300 border border-emerald-900/40',
    ghost: 'bg-transparent hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-[10px] gap-1',
    md: 'px-3.5 py-1.5 text-xs gap-1.5',
    lg: 'px-5 py-2.5 text-sm gap-2'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
