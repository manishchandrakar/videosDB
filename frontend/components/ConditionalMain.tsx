'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }
  return <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>;
}
