import React, { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'content'
> {
  buttonStyle: 'primary' | 'outlined' | 'text';
  size?: 'medium' | 'large';
  buttonType?: 'button' | 'submit' | 'reset';
  content?: string | React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    buttonStyle,
    buttonType = 'button',
    content,
    size = 'medium',
    onClick,
    disabled,
    children,
    ...props
  },
  ref
) {
  if (buttonStyle === 'primary') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        ref={ref}
        type={buttonType}
        className={`bg-brand-surface-default hover:bg-brand-dark transition-colors whitespace-nowrap duration-150 text-string-16 text-brand-text-on-default px-4 ${size === 'medium' ? 'py-2' : 'py-3'} rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        {...props}
      >
        {content}
      </button>
    );
  }
  if (buttonStyle === 'outlined') {
    return (
      <button
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        type={buttonType}
        className={`border border-neutral-border-default px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap text-string-16 text-neutral-text-default ${size === 'medium' ? 'py-2' : 'py-3'} hover:text-brand-surface-default hover:border-brand-border-default transition-colors duration-150`}
        {...props}
      >
        {content}
      </button>
    );
  }
  if (buttonStyle === 'text') {
    return (
      <button
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        type={buttonType}
        className={`flex flex-row text-neutral-text-weak whitespace-nowrap ${
          disabled
            ? 'cursor-not-allowed opacity-50 hover:none'
            : 'cursor-pointer text-neutral-text-default  hover:text-neutral-text-strong'
        }`}
        {...props}
      >
        {children}
      </button>
    );
  }
});

Button.displayName = 'Button';

export default Button;
