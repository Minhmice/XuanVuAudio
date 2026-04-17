"use client";

import { useActionState } from "react";

import { brandDetailFormAction } from "./actions";
import type { BrandDetailFormState } from "./actions";

const INITIAL_STATE: BrandDetailFormState = null;

export function BrandDetailForm(props: {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isPublished: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    brandDetailFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="brand-detail-form">
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
          Tên thương hiệu
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={props.name}
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
          defaultValue={props.slug}
          required
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="logoUrl" className="text-sm font-medium text-card-foreground">
          Logo URL (tùy chọn)
        </label>
        <input
          id="logoUrl"
          name="logoUrl"
          type="url"
          defaultValue={props.logoUrl ?? ""}
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        {props.isPublished ? (
          <button
            type="submit"
            name="intent"
            value="unpublish"
            disabled={isPending}
            className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent disabled:opacity-50"
          >
            Ẩn thương hiệu
          </button>
        ) : (
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={isPending}
            className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent disabled:opacity-50"
          >
            Hiển thị thương hiệu
          </button>
        )}
      </div>
    </form>
  );
}

