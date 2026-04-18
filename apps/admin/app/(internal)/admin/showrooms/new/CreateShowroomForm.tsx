"use client";

import { useActionState } from "react";

import { createShowroomFormAction } from "./actions";
import type { CreateShowroomFormState } from "./actions";

const INITIAL_STATE: CreateShowroomFormState = null;

export function CreateShowroomForm() {
  const [state, formAction, isPending] = useActionState(
    createShowroomFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="create-showroom-form">
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
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="Showroom Quận 1"
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
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
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
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="0900 000 000"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo showroom"}
        </button>
      </div>
    </form>
  );
}

