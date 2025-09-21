'use client';

import React, { type HTMLAttributes, type ButtonHTMLAttributes, type FormEvent, forwardRef, type ReactNode } from 'react';

// Button Components
interface MaterialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'filled-tonal';
  size?: 'small' | 'medium' | 'large';
  href?: string;
  target?: string;
  hasIcon?: boolean;
  trailingIcon?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, MaterialButtonProps>(
  ({ variant = 'filled', className, children, href, target, hasIcon, trailingIcon, ...props }, ref) => {
    const tagName = variant === 'filled' ? 'md-filled-button' :
      variant === 'outlined' ? 'md-outlined-button' :
        variant === 'text' ? 'md-text-button' :
          variant === 'elevated' ? 'md-elevated-button' :
            variant === 'filled-tonal' ? 'md-filled-tonal-button' : 'md-filled-button';

    const elementProps = {
      ...props,
      ref,
      class: className,
      href,
      target,
      'has-icon': hasIcon,
      'trailing-icon': trailingIcon
    };

    return React.createElement(tagName as any, elementProps, children);
  }
);
Button.displayName = 'Button';

// Icon Button Components
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'standard' | 'filled' | 'filled-tonal' | 'outlined';
  toggle?: boolean;
  selected?: boolean;
  href?: string;
  target?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'standard', className, children, toggle, selected, href, target, ...props }, ref) => {
    const tagName = variant === 'filled' ? 'md-filled-icon-button' :
      variant === 'filled-tonal' ? 'md-filled-tonal-icon-button' :
        variant === 'outlined' ? 'md-outlined-icon-button' : 'md-icon-button';

    const elementProps = {
      ...props,
      ref,
      class: className,
      toggle,
      selected,
      href,
      target
    };

    return React.createElement(tagName as any, elementProps, children);
  }
);
IconButton.displayName = 'IconButton';

// Text Field Components
interface TextFieldProps extends HTMLAttributes<HTMLInputElement> {
  variant?: 'filled' | 'outlined';
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
  multiple?: boolean;
  name?: string;
  autocomplete?: string;
  prefixText?: string;
  suffixText?: string;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  onFocus?: (e: FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: FormEvent<HTMLInputElement>) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ variant = 'outlined', className, ...props }, ref) => {
    const tagName = variant === 'filled' ? 'md-filled-text-field' : 'md-outlined-text-field';

    const elementProps = {
      ...props,
      ref,
      class: className,
      'error-text': props.errorText,
      'supporting-text': props.supportingText,
      'prefix-text': props.prefixText,
      'suffix-text': props.suffixText,
      'has-leading-icon': props.hasLeadingIcon,
      'has-trailing-icon': props.hasTrailingIcon
    };

    return React.createElement(tagName as any, elementProps);
  }
);
TextField.displayName = 'TextField';

// Select Components
interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  variant?: 'filled' | 'outlined';
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  value?: string;
  name?: string;
  quick?: boolean;
  onInput?: (e: FormEvent<HTMLSelectElement>) => void;
  onFocus?: (e: FormEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FormEvent<HTMLSelectElement>) => void;
  onClose?: (e: FormEvent<HTMLSelectElement>) => void;
  onOpen?: (e: FormEvent<HTMLSelectElement>) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'outlined', className, children, ...props }, ref) => {
    const tagName = variant === 'filled' ? 'md-filled-select' : 'md-outlined-select';

    const elementProps = {
      ...props,
      ref,
      class: className,
      'error-text': props.errorText,
      'supporting-text': props.supportingText
    };

    return React.createElement(tagName as any, elementProps, children);
  }
);
Select.displayName = 'Select';

// Select Option Component
interface SelectOptionProps extends HTMLAttributes<HTMLElement> {
  value?: string;
  selected?: boolean;
  disabled?: boolean;
  headline?: string;
  supportingText?: string;
  trailingText?: string;
  hasIcon?: boolean;
  displayText?: string;
}

export const SelectOption = forwardRef<HTMLElement, SelectOptionProps>(
  ({ className, children, headline, supportingText, trailingText, hasIcon, displayText, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      headline,
      'supporting-text': supportingText,
      'trailing-text': trailingText,
      'has-icon': hasIcon,
      'display-text': displayText
    };

    return React.createElement('md-select-option' as any, elementProps, children);
  }
);
SelectOption.displayName = 'SelectOption';

// Card Components
interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  disabled?: boolean;
  href?: string;
  target?: string;
}

export const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant = 'elevated', className, children, ...props }, ref) => {
    const tagName = variant === 'filled' ? 'md-filled-card' :
      variant === 'outlined' ? 'md-outlined-card' : 'md-elevated-card';

    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement(tagName as any, elementProps, children);
  }
);
Card.displayName = 'Card';

// Chip Components
interface ChipProps extends HTMLAttributes<HTMLElement> {
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';
  label?: string;
  disabled?: boolean;
  selected?: boolean;
  removable?: boolean;
  href?: string;
  target?: string;
  elevated?: boolean;
  hasIcon?: boolean;
  onRemove?: () => void;
}

export const Chip = forwardRef<HTMLElement, ChipProps>(
  ({ variant = 'assist', className, children, hasIcon, onRemove, ...props }, ref) => {
    const tagName = variant === 'filter' ? 'md-filter-chip' :
      variant === 'input' ? 'md-input-chip' :
        variant === 'suggestion' ? 'md-suggestion-chip' : 'md-assist-chip';

    const elementProps = {
      ...props,
      ref,
      class: className,
      'has-icon': hasIcon
    };

    if (onRemove) {
      (elementProps as any).onremove = onRemove;
    }

    return React.createElement(tagName as any, elementProps, children);
  }
);
Chip.displayName = 'Chip';

// Chip Set Component
interface ChipSetProps extends HTMLAttributes<HTMLElement> {
  multiSelect?: boolean;
}

export const ChipSet = forwardRef<HTMLElement, ChipSetProps>(
  ({ className, children, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'multi-select': props.multiSelect
    };

    return React.createElement('md-chip-set' as any, elementProps, children);
  }
);
ChipSet.displayName = 'ChipSet';

// FAB Components
interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  lowered?: boolean;
  extended?: boolean;
}

export const FAB = forwardRef<HTMLButtonElement, FABProps>(
  ({ className, children, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement('md-fab' as any, elementProps, children);
  }
);
FAB.displayName = 'FAB';

// Branded FAB Component
interface BrandedFABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  lowered?: boolean;
}

export const BrandedFAB = forwardRef<HTMLButtonElement, BrandedFABProps>(
  ({ className, children, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement('md-branded-fab' as any, elementProps, children);
  }
);
BrandedFAB.displayName = 'BrandedFAB';

// Icon Component
interface IconProps extends HTMLAttributes<HTMLElement> {
  filled?: boolean;
  size?: number | string;
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ className, children, filled, size, style, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      filled,
      style: {
        ...style,
        ...(size && { fontSize: typeof size === 'number' ? `${size}px` : size })
      }
    };

    return React.createElement('md-icon' as any, elementProps, children);
  }
);
Icon.displayName = 'Icon';

// List Components
interface ListProps extends HTMLAttributes<HTMLElement> {
  type?: 'list' | 'menu';
}

export const List = forwardRef<HTMLElement, ListProps>(
  ({ className, children, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement('md-list' as any, elementProps, children);
  }
);
List.displayName = 'List';

interface ListItemProps extends HTMLAttributes<HTMLElement> {
  disabled?: boolean;
  type?: 'text' | 'button' | 'link';
  href?: string;
  target?: string;
  headline?: string;
  supportingText?: string;
  trailingText?: string;
  multiLineSupportingText?: boolean;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  hasLeadingImage?: boolean;
  hasLeadingVideo?: boolean;
  hasTrailingImage?: boolean;
  hasTrailingVideo?: boolean;
}

export const ListItem = forwardRef<HTMLElement, ListItemProps>(
  ({ className, children, headline, supportingText, trailingText, multiLineSupportingText, hasLeadingIcon, hasTrailingIcon, hasLeadingImage, hasLeadingVideo, hasTrailingImage, hasTrailingVideo, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      headline,
      'supporting-text': supportingText,
      'trailing-text': trailingText,
      'multiline-supporting-text': multiLineSupportingText,
      'has-leading-icon': hasLeadingIcon,
      'has-trailing-icon': hasTrailingIcon,
      'has-leading-image': hasLeadingImage,
      'has-leading-video': hasLeadingVideo,
      'has-trailing-image': hasTrailingImage,
      'has-trailing-video': hasTrailingVideo
    };

    return React.createElement('md-list-item' as any, elementProps, children);
  }
);
ListItem.displayName = 'ListItem';

// Menu Components
interface MenuProps extends HTMLAttributes<HTMLElement> {
  open?: boolean;
  anchor?: string;
  positioning?: 'absolute' | 'fixed' | 'document' | 'popover';
  quick?: boolean;
  hasOverflow?: boolean;
  onOpening?: () => void;
  onOpened?: () => void;
  onClosing?: () => void;
  onClosed?: () => void;
}

export const Menu = forwardRef<HTMLElement, MenuProps>(
  ({ className, children, hasOverflow, onOpening, onOpened, onClosing, onClosed, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'has-overflow': hasOverflow
    };

    if (onOpening) (elementProps as any).onopening = onOpening;
    if (onOpened) (elementProps as any).onopened = onOpened;
    if (onClosing) (elementProps as any).onclosing = onClosing;
    if (onClosed) (elementProps as any).onclosed = onClosed;

    return React.createElement('md-menu' as any, elementProps, children);
  }
);
Menu.displayName = 'Menu';

interface MenuItemProps extends HTMLAttributes<HTMLElement> {
  disabled?: boolean;
  type?: 'menuitem' | 'option';
  href?: string;
  target?: string;
  keepOpen?: boolean;
  selected?: boolean;
  headline?: string;
  supportingText?: string;
  trailingText?: string;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
}

export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  ({ className, children, keepOpen, headline, supportingText, trailingText, hasLeadingIcon, hasTrailingIcon, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'keep-open': keepOpen,
      headline,
      'supporting-text': supportingText,
      'trailing-text': trailingText,
      'has-leading-icon': hasLeadingIcon,
      'has-trailing-icon': hasTrailingIcon
    };

    return React.createElement('md-menu-item' as any, elementProps, children);
  }
);
MenuItem.displayName = 'MenuItem';

// Navigation Components
interface NavigationBarProps extends HTMLAttributes<HTMLElement> {
  activeIndex?: number;
  hideInactiveLabels?: boolean;
  onActivated?: (event: CustomEvent) => void;
}

export const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(
  ({ className, children, activeIndex, hideInactiveLabels, onActivated, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'active-index': activeIndex,
      'hide-inactive-labels': hideInactiveLabels
    };

    if (onActivated) {
      (elementProps as any).onactivated = onActivated;
    }

    return React.createElement('md-navigation-bar' as any, elementProps, children);
  }
);
NavigationBar.displayName = 'NavigationBar';

interface NavigationTabProps extends HTMLAttributes<HTMLElement> {
  label?: string;
  disabled?: boolean;
  active?: boolean;
  hideInactiveLabel?: boolean;
  badgeValue?: string;
  showBadge?: boolean;
}

export const NavigationTab = forwardRef<HTMLElement, NavigationTabProps>(
  ({ className, children, hideInactiveLabel, badgeValue, showBadge, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'hide-inactive-label': hideInactiveLabel,
      'badge-value': badgeValue,
      'show-badge': showBadge
    };

    return React.createElement('md-navigation-tab' as any, elementProps, children);
  }
);
NavigationTab.displayName = 'NavigationTab';

// Progress Components
interface CircularProgressProps extends HTMLAttributes<HTMLElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  fourColor?: boolean;
}

export const CircularProgress = forwardRef<HTMLElement, CircularProgressProps>(
  ({ className, fourColor, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'four-color': fourColor
    };

    return React.createElement('md-circular-progress' as any, elementProps);
  }
);
CircularProgress.displayName = 'CircularProgress';

interface LinearProgressProps extends HTMLAttributes<HTMLElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  buffer?: number;
  fourColor?: boolean;
}

export const LinearProgress = forwardRef<HTMLElement, LinearProgressProps>(
  ({ className, fourColor, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'four-color': fourColor
    };

    return React.createElement('md-linear-progress' as any, elementProps);
  }
);
LinearProgress.displayName = 'LinearProgress';

// Form Controls
interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  indeterminate?: boolean;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  name?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement('md-checkbox' as any, elementProps);
  }
);
Checkbox.displayName = 'Checkbox';

interface RadioProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  name?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement('md-radio' as any, elementProps);
  }
);
Radio.displayName = 'Radio';

interface SwitchProps extends HTMLAttributes<HTMLInputElement> {
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  name?: string;
  showOnlySelectedIcon?: boolean;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, showOnlySelectedIcon, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'show-only-selected-icon': showOnlySelectedIcon
    };

    return React.createElement('md-switch' as any, elementProps);
  }
);
Switch.displayName = 'Switch';

// Slider Component
interface SliderProps extends HTMLAttributes<HTMLInputElement> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  labeled?: boolean;
  range?: boolean;
  valueStart?: number;
  valueEnd?: number;
  valueLabel?: string;
  valueLabelStart?: string;
  valueLabelEnd?: string;
  name?: string;
  nameStart?: string;
  nameEnd?: string;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, valueStart, valueEnd, valueLabel, valueLabelStart, valueLabelEnd, nameStart, nameEnd, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'value-start': valueStart,
      'value-end': valueEnd,
      'value-label': valueLabel,
      'value-label-start': valueLabelStart,
      'value-label-end': valueLabelEnd,
      'name-start': nameStart,
      'name-end': nameEnd
    };

    return React.createElement('md-slider' as any, elementProps);
  }
);
Slider.displayName = 'Slider';

// Dialog Components
interface DialogProps extends HTMLAttributes<HTMLElement> {
  open?: boolean;
  quick?: boolean;
  type?: 'alert' | 'confirm' | 'prompt';
  onOpening?: () => void;
  onOpened?: () => void;
  onClosing?: () => void;
  onClosed?: () => void;
  onCancel?: () => void;
}

export const Dialog = forwardRef<HTMLElement, DialogProps>(
  ({ className, children, onOpening, onOpened, onClosing, onClosed, onCancel, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    if (onOpening) (elementProps as any).onopening = onOpening;
    if (onOpened) (elementProps as any).onopened = onOpened;
    if (onClosing) (elementProps as any).onclosing = onClosing;
    if (onClosed) (elementProps as any).onclosed = onClosed;
    if (onCancel) (elementProps as any).oncancel = onCancel;

    return React.createElement('md-dialog' as any, elementProps, children);
  }
);
Dialog.displayName = 'Dialog';

// Divider Component
interface DividerProps extends HTMLAttributes<HTMLElement> {
  inset?: boolean;
  insetStart?: boolean;
  insetEnd?: boolean;
}

export const Divider = forwardRef<HTMLElement, DividerProps>(
  ({ className, insetStart, insetEnd, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'inset-start': insetStart,
      'inset-end': insetEnd
    };

    return React.createElement('md-divider' as any, elementProps);
  }
);
Divider.displayName = 'Divider';

// Tabs Components
interface TabsProps extends HTMLAttributes<HTMLElement> {
  activeTabIndex?: number;
  autoActivate?: boolean;
  onTabActivated?: (event: CustomEvent) => void;
}

export const Tabs = forwardRef<HTMLElement, TabsProps>(
  ({ className, children, activeTabIndex, autoActivate, onTabActivated, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className,
      'active-tab-index': activeTabIndex,
      'auto-activate': autoActivate
    };

    if (onTabActivated) {
      (elementProps as any).ontabactivated = onTabActivated;
    }

    return React.createElement('md-tabs' as any, elementProps, children);
  }
);
Tabs.displayName = 'Tabs';

interface TabProps extends HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  active?: boolean;
  hasIcon?: boolean;
  iconOnly?: boolean;
  inlineIcon?: boolean;
}

export const Tab = forwardRef<HTMLElement, TabProps>(
  ({ variant = 'primary', className, children, hasIcon, iconOnly, inlineIcon, ...props }, ref) => {
    const tagName = variant === 'secondary' ? 'md-secondary-tab' : 'md-primary-tab';

    const elementProps = {
      ...props,
      ref,
      class: className,
      'has-icon': hasIcon,
      'icon-only': iconOnly,
      'inline-icon': inlineIcon
    };

    return React.createElement(tagName as any, elementProps, children);
  }
);
Tab.displayName = 'Tab';

// Elevation Component
interface ElevationProps extends HTMLAttributes<HTMLElement> {
  level?: 0 | 1 | 2 | 3 | 4 | 5;
}

export const Elevation = forwardRef<HTMLElement, ElevationProps>(
  ({ className, ...props }, ref) => {
    const elementProps = {
      ...props,
      ref,
      class: className
    };

    return React.createElement('md-elevation' as any, elementProps);
  }
);
Elevation.displayName = 'Elevation';