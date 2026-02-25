'use client';

import { ReactNode } from 'react';
import { Button as HeroButton } from '@heroui/react';
import type { ButtonProps as HeroButtonProps } from '@heroui/react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

type HeroVariant = HeroButtonProps['variant'];
type HeroColor = HeroButtonProps['color'];

const variantMap: Record<Variant, { variant: HeroVariant; color: HeroColor }> = {
  primary: { variant: 'solid', color: 'primary' },
  secondary: { variant: 'solid', color: 'secondary' },
  danger: { variant: 'solid', color: 'danger' },
  ghost: { variant: 'light', color: 'default' },
  outline: { variant: 'bordered', color: 'default' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  type = 'button',
  onClick,
}: ButtonProps) {
  const { variant: heroVariant, color } = variantMap[variant];

  return (
    <HeroButton
      variant={heroVariant}
      color={color}
      size={size}
      isLoading={loading}
      isDisabled={disabled || loading}
      className={className}
      type={type}
      onPress={onClick}
    >
      {children}
    </HeroButton>
  );
}
