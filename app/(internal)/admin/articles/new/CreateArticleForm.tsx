"use client";

import { useActionState } from "react";

import type { ArticleCategorySummary } from "@/app/actions/article-categories";
import type { CreateArticleFormState } from "./actions";
import { createArticleFormAction } from "./actions";

const INITIAL_STATE: CreateArticleFormState = null;

export function CreateArticleForm({ categories }: { categories: ArticleCategorySummary[] }) {
  const [state, formAction, isPending] = useActionState(
    createArticleFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="create-article-form">
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
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Hướng dẫn chọn tai nghe cho người mới bắt đầu"
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
          placeholder="huong-dan-chon-tai-nghe"
        />
        <p className="text-xs text-muted-foreground">Dùng cho URL (không dấu, dùng dấu gạch ngang).</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="excerpt" className="text-sm font-medium text-card-foreground">
          Tóm tắt (tuỳ chọn)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Bài viết giúp bạn chọn đúng loại tai nghe theo nhu cầu, ngân sách và gu âm."
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="coverImageUrl" className="text-sm font-medium text-card-foreground">
          Ảnh cover URL (tuỳ chọn)
        </label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="authorName" className="text-sm font-medium text-card-foreground">
            Tác giả (tuỳ chọn)
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            autoComplete="off"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Xuan Vu Audio"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-medium text-card-foreground">
            Danh mục (tuỳ chọn)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue=""
          >
            <option value="">—</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="content" className="text-sm font-medium text-card-foreground">
          Nội dung
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Viết nội dung bài..."
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo bài viết"}
        </button>
      </div>
    </form>
  );
}

