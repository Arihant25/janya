'use client';

import { type HTMLAttributes, type ButtonHTMLAttributes, type FormEvent, forwardRef } from 'react';

interface MaterialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'outlined' | 'filled';
  dense?: boolean;
}

type MaterialComponent = 'md-text-button' | 'md-outlined-button' | 'md-filled-button';

export const Button = forwardRef<HTMLButtonElement, MaterialButtonProps>(
  ({ variant = 'text', className, children, ...props }, ref) => {
    const Tag = `md-${variant}-button` as MaterialComponent;
    return (
      // @ts-ignore - Web Components
      <Tag {...props} ref={ref} class={className}>
        {children}
      </Tag>
    );
  }
);
Button.displayName = 'Button';

interface TextFieldProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  value?: string;
  required?: boolean;
  rows?: number;
  error?: boolean;
  errorText?: string;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, ...props }, ref) => {
    // @ts-ignore - Web Components
    return <md-outlined-text-field {...props} ref={ref} class={className} />;
  }
);
TextField.displayName = 'TextField';

interface IconProps extends HTMLAttributes<HTMLElement> {
  slot?: string;
}

type IconComponent = 'md-icon';

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ className, children, ...props }, ref) => {
    const Tag = 'md-icon' as IconComponent;
    return (
      // @ts-ignore - Web Components
      <Tag {...props} ref={ref} class={className}>
        {children}
      </Tag>
    );
  }
);
Icon.displayName = 'Icon';