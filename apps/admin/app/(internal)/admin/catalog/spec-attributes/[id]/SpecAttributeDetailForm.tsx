"use client";

import { useActionState } from "react";

import type { SpecAttributeSummary } from "@/app/actions/spec-attribute-definitions";

import { updateSpecAttributeFormAction, type SpecAttributeDetailFormState } from "./actions";

const INITIAL_STATE: SpecAttributeDetailFormState = null;

export function SpecAttributeDetailForm({ attribute }: { attribute: SpecAttributeSummary }) {
  const bound = updateSpecAttributeFormAction.bind(null, attribute.id);
  const [state, formAction, isPending] = useActionState(bound, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" data-testid="spec-attribute-detail-form">
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
        <span className="text-sm font-medium text-card-foreground">Slug (cố định)</span>
        <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">{attribute.slug}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="labelVi" className="text-sm font-medium text-card-foreground">
          Nhãn (tiếng Việt)
        </label>
        <input
          id="labelVi"
          name="labelVi"
          type="text"
          required
          defaultValue={attribute.labelVi}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="groupName" className="text-sm font-medium text-card-foreground">
          Nhóm hiển thị
        </label>
        <input
          id="groupName"
          name="groupName"
          type="text"
          required
          defaultValue={attribute.groupName}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sortOrder" className="text-sm font-medium text-card-foreground">
          Thứ tự
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          required
          defaultValue={attribute.sortOrder}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={attribute.isActive}
          className="h-4 w-4 rounded border"
        />
        <label htmlFor="isActive" className="text-sm text-card-foreground">
          Đang kích hoạt
        </label>
      </div>

      <div className="text-sm text-muted-foreground">
        Kiểu giá trị: <span className="font-medium text-card-foreground">{attribute.valueType}</span> (không đổi sau khi
        tạo)
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Đang lưu…" : "Lưu thay đổi"}
      </button>
    </form>
  );
}
