'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { UserRole } from '@/types';

export default function LoginLandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === UserRole.SUPER_ADMIN) router.replace('/admin');
    else if (user?.role === UserRole.MINI_ADMIN) router.replace('/mini-admin');
    else router.replace('/login/admin');
  }, [isLoading, user, router]);

  return null;
}
