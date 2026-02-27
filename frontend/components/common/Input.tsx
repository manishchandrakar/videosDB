'use client';

import { ChangeEvent, forwardRef, ReactNode } from 'react';
import { Input as HeroInput } from '@heroui/react';

interface InputProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  endContent?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, wrapperClassName = '', className = '', ...props },
  ref
) {
  return (
    <HeroInput
      ref={ref}
      label={label}
      variant="bordered"
      labelPlacement="outside"
      isInvalid={!!error}
      errorMessage={error}
      classNames={{
        base: wrapperClassName,
        inputWrapper: className || undefined,
      }}
      {...props}
    />
  );
});

export default Input;
