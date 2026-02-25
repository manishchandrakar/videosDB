'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignup } from '@/app/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { registerSchema, RegisterFormData } from '@/lib/schemas';

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: signup, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    delayError: 300,
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signup({ username: data.username, email: data.email, password: data.password });
      router.push('/');
    } catch {
      // error shown via apiError below
    }
  };

  const apiError = error
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Registration failed'
    : null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join VideoHub to start watching</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Username"
              type="text"
              placeholder="your_username"
              error={errors.username?.message}
              autoComplete="username"
              {...register('username')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="new-password"
              {...register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              {...register('confirmPassword')}
            />

            {apiError && (
              <p className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-400">
                {apiError}
              </p>
            )}

            <Button type="submit" loading={isPending} className="w-full mt-1">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
