import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full bg-bg-surface2 border rounded-[8px] px-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-tertiary transition-colors duration-150 focus:outline-none focus:ring-1 ${error
                        ? 'border-error focus:border-error focus:ring-error'
                        : 'border-border-default focus:border-accent focus:ring-accent'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-[12px] text-error">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-[12px] text-text-tertiary">{helperText}</p>
            )}
        </div>
    );
}
