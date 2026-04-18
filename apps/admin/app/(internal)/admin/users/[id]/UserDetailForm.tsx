"use client";

import { useActionState } from "react";
import type { InternalUserRole } from "@xuanvu/shared/auth/role";
import { userDetailFormAction } from "./actions";
import type { UserDetailFormState } from "./actions";

const INITIAL_STATE: UserDetailFormState = null;

const ROLE_LABELS: Record<InternalUserRole, string> = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
};

export function UserDetailForm(props: {
  userId: string;
  email: string;
  username: string;
  role: InternalUserRole;
  isDeactivated: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    userDetailFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="user-detail-form">
      <input type="hidden" name="userId" value={props.userId} />

      {state?.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-testid="form-error"
        >
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">Email</label>
          <div className="rounded-md border bg-muted px-3 py-2 text-sm text-card-foreground">
            {props.email}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">
            Tên đăng nhập
          </label>
          <div className="rounded-md border bg-muted px-3 py-2 text-sm text-card-foreground">
            {props.username}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="role" className="text-sm font-medium text-card-foreground">
          Vai trò
        </label>
        <select
          id="role"
          name="role"
          defaultValue={props.role}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        >
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          name="intent"
          value="updateRole"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        {props.isDeactivated ? (
          <button
            type="submit"
            name="intent"
            value="reactivate"
            disabled={isPending}
            className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent disabled:opacity-50"
          >
            Kích hoạt lại
          </button>
        ) : (
          <button
            type="submit"
            name="intent"
            value="deactivate"
            disabled={isPending}
            className="inline-flex items-center rounded-md border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            Vô hiệu hóa
          </button>
        )}
      </div>
    </form>
  );
}

