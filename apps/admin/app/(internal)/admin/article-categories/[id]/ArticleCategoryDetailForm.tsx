"use client";

import { useActionState } from "react";

import type { ArticleCategoryDetailFormState } from "./actions";
import { articleCategoryDetailFormAction } from "./actions";

const INITIAL_STATE: ArticleCategoryDetailFormState = null;

export function ArticleCategoryDetailForm(props: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    articleCategoryDetailFormAction,
    INITIAL_STATE,
  );

  return (
    <form
      action={formAction}
      className="space-y-4"
      data-testid="article-category-detail-form"
    >
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
          Tên danh mục
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={props.name}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
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
          defaultValue={props.slug}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-card-foreground"
        >
          Mô tả (tuỳ chọn)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={props.description ?? ""}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
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
          onClick={(event) => {
            if (!confirm("Xóa danh mục này?")) event.preventDefault();
          }}
          className="inline-flex items-center rounded-md border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          Xóa
        </button>
      </div>
    </form>
  );
}

