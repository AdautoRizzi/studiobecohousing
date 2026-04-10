import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-semibold text-foreground"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={`
            flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base 
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
            focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50
            transition-all
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
