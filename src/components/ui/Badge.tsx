import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'secondary', children, className = '', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide font-mono border uppercase';

  const variantStyles = {
    primary: 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20',
    secondary: 'bg-[var(--bg-panel)] text-[var(--text-muted)] border-[var(--border-main)]',
    success: 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-950/20 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-950/20 text-rose-400 border-rose-500/20'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
