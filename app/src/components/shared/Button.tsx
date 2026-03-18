import React from 'react';

type ButtonProps = React.ComponentProps<'button'> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'ai-gradient text-white hover:opacity-90 rounded-lg',
        secondary: 'bg-bg-surface2 text-text-primary border border-border-default hover:bg-bg-surface3 rounded-lg',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-state-hover rounded-lg',
        icon: 'text-text-secondary hover:text-text-primary hover:bg-state-hover rounded-full',
    };

    const sizeStyles = {
        sm: variant === 'icon' ? 'w-8 h-8' : 'px-3 py-1.5 text-[12px]',
        md: variant === 'icon' ? 'w-9 h-9' : 'px-4 py-2.5 text-[14px]',
        lg: variant === 'icon' ? 'w-10 h-10' : 'px-6 py-3 text-[14px]',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {children}
        </button>
    );
}
