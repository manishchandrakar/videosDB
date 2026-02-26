"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUsers, useCreateUser } from "@/app/hooks/useAuth";
import { UserRole, UserPublic } from "@/types";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import Spinner from "@/components/common/Spinner";
import { createUserSchema } from "@/lib/schemas";

type CreateUserForm = z.infer<typeof createUserSchema>;

function TableContent({ users }: { users: UserPublic[] }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground">
        <svg
          className="mb-3 h-10 w-10 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="text-sm">No users yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              User
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Email
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Role
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr
              key={user.id}
              className="bg-card hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase",
                      user.isBlocked
                        ? "bg-red-900/40 text-red-400"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {user.username[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {user.username}
                    </span>
                    {user.isBlocked && (
                      <span className="text-xs text-red-400">Blocked</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">
                <Badge variant="default">Mini Admin</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const UsersPage = () => {
  const { data: users = [], isLoading, error: usersError } = useUsers();
  const {
    mutate: createUser,
    isPending: isCreating,
    error: createError,
    reset: resetMutation,
  } = useCreateUser();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });

  const openModal = () => {
    reset();
    resetMutation();
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    reset();
    resetMutation();
  };

  const onSubmit = (data: CreateUserForm) => {
    createUser({ ...data }, { onSuccess: closeModal });
  };

  const createApiError = createError
    ? ((createError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Failed to create user")
    : null;

  const miniAdmins = users.filter((u) => u.role === UserRole.MINI_ADMIN);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      );
    }
    if (usersError) {
      const msg = (usersError as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-800 bg-red-900/10 py-12 text-red-400 gap-2">
          <p className="text-sm font-medium">Failed to load users</p>
          <p className="text-xs text-muted-foreground">
            {msg ??
              "Make sure the backend server is running and restarted to apply permission changes."}
          </p>
        </div>
      );
    }
    return <TableContent users={miniAdmins} />;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Mini Admin accounts — {miniAdmins.length} total
          </p>
        </div>
        <Button onClick={openModal}>+ Add User</Button>
      </div>

      {renderBody()}

      {/* Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full cursor-default"
            onClick={closeModal}
            aria-label="Close modal"
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Add User
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-6"
            >
              <Input
                label="Username"
                placeholder="john_doe"
                error={errors.username?.message}
                {...register("username")}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars, uppercase, number, special char"
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Role
                </label>

                <select
                  {...register("role")}
                  className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={UserRole.MINI_ADMIN}>Mini Admin</option>
                  <option value={UserRole.USER}>User</option>
                </select>

                {errors.role && (
                  <p className="text-xs text-red-400">{errors.role.message}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                This account will be created as{" "}
                <span className="font-medium text-foreground">
                  Mini Admin or User
                </span>
                .
              </p>

              {createApiError && (
                <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
                  {createApiError}
                </p>
              )}

              <div className="flex gap-3 justify-end pt-2 border-t border-border mt-2">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" loading={isCreating}>
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
