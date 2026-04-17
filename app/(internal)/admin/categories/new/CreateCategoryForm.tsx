"use client";

import { useActionState } from "react";

import { createCategoryFormAction } from "./actions";
import type { CreateCategoryFormState } from "./actions";

const INITIAL_STATE: CreateCategoryFormState = null;

export function CreateCategoryForm() {
  const [state, formAction, isPending] = useActionState(
    createCategoryFormAction,
    INITIAL_STATE,
  );

  return (
    <form
      action={formAction}
      className="space-y-4"
      data-testid="create-category-form"
    >
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
          Tên danh mục
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tai nghe"
        />
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
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="tai-nghe"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-card-foreground"
        >
          Mô tả (tùy chọn)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Danh mục sản phẩm..."
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo danh mục"}
        </button>
      </div>
    </form>
  );
}

