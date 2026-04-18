"use client";

import { useActionState } from "react";

import type { PolicyPageDetailFormState } from "./actions";
import { policyPageDetailFormAction } from "./actions";

const INITIAL_STATE: PolicyPageDetailFormState = null;

export function PolicyPageDetailForm(props: {
  id: string;
  keyValue: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentMarkdown: string;
  isPublished: boolean;
}) {
  const [state, formAction, isPending] = useActionState(policyPageDetailFormAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" data-testid="policy-page-detail-form">
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
        <label htmlFor="title" className="text-sm font-medium text-card-foreground">
          Tiêu đề
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={props.title}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
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
            defaultValue={props.keyValue}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
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
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          />
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
          defaultValue={props.excerpt ?? ""}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contentMarkdown" className="text-sm font-medium text-card-foreground">
          Nội dung (Markdown)
        </label>
        <textarea
          id="contentMarkdown"
          name="contentMarkdown"
          rows={14}
          defaultValue={props.contentMarkdown}
          className="w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-card-foreground">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={props.isPublished}
          className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring"
        />
        Xuất bản
      </label>

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
            if (!confirm("Xóa trang chính sách này?")) event.preventDefault();
          }}
          className="inline-flex items-center rounded-md border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          Xóa
        </button>
      </div>
    </form>
  );
}

