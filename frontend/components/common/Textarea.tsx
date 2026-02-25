'use client';

import { ChangeEvent, FocusEvent } from 'react';
import { Textarea as HeroTextarea } from '@heroui/react';

interface TextareaProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
  rows?: number;
  maxRows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  wrapperClassName?: string;
}

export default function Textarea({
  label,
  error,
  wrapperClassName = '',
  className = '',
  rows,
  onChange,
  onBlur,
  ...props
}: Readonly<TextareaProps>) {
  return (
    <HeroTextarea
      label={label}
      variant="bordered"
      labelPlacement="outside"
      isInvalid={!!error}
      errorMessage={error}
      minRows={rows ?? 3}
      classNames={{
        base: wrapperClassName,
        inputWrapper: className || undefined,
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={onChange as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur={onBlur as any}
      {...props}
    />
  );
}
