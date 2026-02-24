'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers, useCreateUser, useDeleteUser } from '@/app/hooks/useAuth';
import { UserRole, UserPublic } from '@/types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';

// ─── Zod schema ───────────────────────────────────────────────────────────────
const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username: letters, numbers, underscores only'),
  email: z.string().email('Please provide a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must include uppercase, lowercase, number and special character'
    ),
  role: z.enum([UserRole.SUPER_ADMIN, UserRole.MINI_ADMIN]),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

// ─── Role helpers ─────────────────────────────────────────────────────────────
type FilterTab = 'all' | UserRole.SUPER_ADMIN | UserRole.MINI_ADMIN;

const roleBadgeVariant = (role: UserRole) =>
  role === UserRole.SUPER_ADMIN ? 'info' : 'default';

const roleLabel = (role: UserRole) =>
  role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Mini Admin';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const { mutate: createUser, isPending: isCreating, error: createError } = useCreateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: UserRole.MINI_ADMIN },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: CreateUserForm) => {
    createUser(data, {
      onSuccess: () => {
        reset();
        setModalOpen(false);
      },
    });
  };

  const handleDelete = (user: UserPublic) => {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    setDeletingId(user.id);
    deleteUser(user.id, { onSettled: () => setDeletingId(null) });
  };

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  const counts = {
    all: users.length,
    [UserRole.SUPER_ADMIN]: users.filter((u) => u.role === UserRole.SUPER_ADMIN).length,
    [UserRole.MINI_ADMIN]: users.filter((u) => u.role === UserRole.MINI_ADMIN).length,
  };

  const apiError =
    createError
      ? (createError as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to create user'
      : null;

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: UserRole.SUPER_ADMIN, label: `Super Admin (${counts[UserRole.SUPER_ADMIN]})` },
    { key: UserRole.MINI_ADMIN, label: `Mini Admin (${counts[UserRole.MINI_ADMIN]})` },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage admin and mini-admin accounts
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add User</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={[
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              filter === key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground">
          <svg className="mb-3 h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user) => (
                <tr key={user.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground uppercase">
                        {user.username[0]}
                      </div>
                      <span className="font-medium text-foreground">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={roleBadgeVariant(user.role as UserRole)}>
                      {roleLabel(user.role as UserRole)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={isDeleting && deletingId === user.id}
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Add New User"
        size="md"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <Button variant="ghost" onClick={() => { setModalOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" loading={isCreating}>
              Create User
            </Button>
          </div>
        }
      >
        <form
          id="create-user-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Username"
            placeholder="john_doe"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 8 chars, uppercase, number, special char"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Role selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Role</label>
            <div className="flex gap-2">
              {([UserRole.MINI_ADMIN, UserRole.SUPER_ADMIN] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setValue('role', r, { shouldValidate: true })}
                  className={[
                    'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    selectedRole === r
                      ? r === UserRole.SUPER_ADMIN
                        ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                        : 'border-zinc-500 bg-zinc-600/20 text-zinc-300'
                      : 'border-border bg-muted text-muted-foreground hover:border-muted-foreground',
                  ].join(' ')}
                >
                  {r === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Mini Admin'}
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-red-400">{errors.role.message}</p>
            )}
          </div>

          {apiError && (
            <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
              {apiError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
