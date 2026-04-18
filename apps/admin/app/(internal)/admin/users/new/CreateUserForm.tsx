"use client";

import { useActionState } from "react";
import { createUserFormAction } from "./actions";
import type { CreateUserFormState } from "./actions";

const INITIAL_STATE: CreateUserFormState = null;

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createUserFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="create-user-form">
      {state?.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-testid="form-error"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-card-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="nhanvien@tainghe.vn"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="username" className="text-sm font-medium text-card-foreground">
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="nhanvien01"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-card-foreground">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="role" className="text-sm font-medium text-card-foreground">
          Vai trò
        </label>
        <select
          id="role"
          name="role"
          defaultValue="staff"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        >
          <option value="staff">Nhân viên</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo người dùng"}
        </button>
      </div>
    </form>
  );
}
