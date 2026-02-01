import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle?: 'primary' | 'outlined' | 'text';
  size?: 'medium' | 'large';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    buttonStyle = 'primary',
    type = 'button',
    size = 'medium',
    disabled,
    children,
    ...props
  },
  ref
) {
  const baseStyles =
    'whitespace-nowrap rounded-lg transition-colors duration-150 flex flex-row items-center justify-center focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-brand-surface-default text-brand-text-on-default hover:bg-brand-dark',
    outlined:
      'border border-neutral-border-default text-neutral-text-default hover:text-brand-surface-default hover:border-brand-border-default',
    text: 'text-neutral-text-default hover:text-neutral-text-strong disabled:hover:text-neutral-text-weak',
  };

  const sizes = {
    medium: 'px-4 py-2 text-string-16',
    large: 'px-4 py-3 text-string-16',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[buttonStyle],
        buttonStyle !== 'text' && sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
