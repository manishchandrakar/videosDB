'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import queryClient from '@/config/queryClient';
import { AuthProvider } from '@/app/context/AuthContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
