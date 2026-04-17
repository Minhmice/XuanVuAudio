"use client";

import { useActionState } from "react";

import type { ArticleCategorySummary } from "@/app/actions/article-categories";
import type { ArticleDetail } from "@/app/actions/articles";
import type { ArticleDetailFormState } from "./actions";
import { articleDetailFormAction } from "./actions";

const INITIAL_STATE: ArticleDetailFormState = null;

function formatTimestamp(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

export function ArticleDetailForm({
  article,
  categories,
}: {
  article: ArticleDetail;
  categories: ArticleCategorySummary[];
}) {
  const [state, formAction, isPending] = useActionState(articleDetailFormAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" data-testid="article-detail-form">
      <input type="hidden" name="id" value={article.id} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-4 py-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-card-foreground">Trạng thái</p>
          {article.status === "published" ? (
            <p className="text-sm text-muted-foreground">
              Đã xuất bản lúc{" "}
              <span className="font-medium text-card-foreground">
                {formatTimestamp(article.publishedAt)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Bản nháp (chưa xuất bản).</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {article.status === "published" ? (
            <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Đã xuất bản
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              Bản nháp
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            Cập nhật: {formatTimestamp(article.updatedAt)}
          </span>
        </div>
      </div>

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
          defaultValue={article.title}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          defaultValue={article.slug}
          required
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="excerpt" className="text-sm font-medium text-card-foreground">
          Tóm tắt (tuỳ chọn)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={article.excerpt ?? ""}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          defaultValue={article.coverImageUrl ?? ""}
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
            defaultValue={article.authorName ?? ""}
            autoComplete="off"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            defaultValue={article.categoryId ?? ""}
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
          rows={14}
          defaultValue={article.content ?? ""}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

        {article.status === "published" ? (
          <button
            type="submit"
            name="intent"
            value="unpublish"
            disabled={isPending}
            className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent disabled:opacity-50"
          >
            Huỷ xuất bản
          </button>
        ) : (
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={isPending}
            className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent disabled:opacity-50"
          >
            Xuất bản
          </button>
        )}

        <button
          type="submit"
          name="intent"
          value="delete"
          disabled={isPending}
          onClick={(e) => {
            if (!window.confirm("Xoá bài viết này? Hành động không thể hoàn tác.")) {
              e.preventDefault();
            }
          }}
          className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/15 disabled:opacity-50"
        >
          Xoá bài viết
        </button>
      </div>
    </form>
  );
}

