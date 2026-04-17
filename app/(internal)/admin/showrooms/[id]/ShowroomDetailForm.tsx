"use client";

import { useActionState } from "react";

import { showroomDetailFormAction } from "./actions";
import type { ShowroomDetailFormState } from "./actions";

const INITIAL_STATE: ShowroomDetailFormState = null;

export function ShowroomDetailForm(props: {
  id: string;
  name: string;
  address: string;
  phone: string;
}) {
  const [state, formAction, isPending] = useActionState(
    showroomDetailFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="showroom-detail-form">
      <input type="hidden" name="id" value={props.id} />

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
        <label htmlFor="name" className="text-sm font-medium text-card-foreground">
          Tên showroom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={props.name}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address" className="text-sm font-medium text-card-foreground">
          Địa chỉ
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          defaultValue={props.address}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
          Số điện thoại
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={props.phone}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          name="intent"
          value="update"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        <button
          type="submit"
          name="intent"
          value="delete"
          disabled={isPending}
          className="inline-flex items-center rounded-md border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          Xóa showroom
        </button>
      </div>
    </form>
  );
}

