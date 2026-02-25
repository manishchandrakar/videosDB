'use client';

import { useState } from 'react';
import { Input as HeroInput } from '@heroui/react';
import Button from '@/components/common/Button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search videos...', defaultValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-xl">
      <HeroInput
        value={value}
        onValueChange={setValue}
        onClear={handleClear}
        placeholder={placeholder}
        variant="bordered"
        size="sm"
        isClearable
        classNames={{ base: 'flex-1' }}
        startContent={
          <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        }
      />
      <Button type="submit" size="md">Search</Button>
    </form>
  );
}
