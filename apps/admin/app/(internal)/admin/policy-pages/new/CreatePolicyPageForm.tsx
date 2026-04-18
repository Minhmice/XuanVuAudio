"use client";

import { useActionState } from "react";

import type { CreatePolicyPageFormState } from "./actions";
import { createPolicyPageFormAction } from "./actions";

const INITIAL_STATE: CreatePolicyPageFormState = null;

export function CreatePolicyPageForm() {
  const [state, formAction, isPending] = useActionState(
    createPolicyPageFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="create-policy-page-form">
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
        <label htmlFor="title" className="text-sm font-medium text-card-foreground">
          Tiêu đề
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="Chính sách giao hàng"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="key" className="text-sm font-medium text-card-foreground">
            Key
          </label>
          <input
            id="key"
            name="key"
            type="text"
            required
            autoComplete="off"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            placeholder="delivery"
          />
          <p className="text-xs text-muted-foreground">
            Định danh nội bộ (ví dụ: delivery, returns, warranty, contact).
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-card-foreground">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            autoComplete="off"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            placeholder="chinh-sach-giao-hang"
          />
          <p className="text-xs text-muted-foreground">Dùng cho URL (không dấu, dùng dấu gạch ngang).</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="excerpt" className="text-sm font-medium text-card-foreground">
          Tóm tắt (tuỳ chọn)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="Mô tả ngắn hiển thị ở meta/preview."
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contentMarkdown" className="text-sm font-medium text-card-foreground">
          Nội dung (Markdown)
        </label>
        <textarea
          id="contentMarkdown"
          name="contentMarkdown"
          rows={12}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="## Nội dung"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-card-foreground">
        <input
          type="checkbox"
          name="isPublished"
          className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring"
        />
        Xuất bản ngay
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo trang"}
        </button>
      </div>
    </form>
  );
}

