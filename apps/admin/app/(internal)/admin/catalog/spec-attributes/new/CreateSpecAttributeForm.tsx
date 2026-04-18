"use client";

import { useActionState } from "react";

import { createSpecAttributeFormAction } from "./actions";
import type { CreateSpecAttributeFormState } from "./actions";

const INITIAL_STATE: CreateSpecAttributeFormState = null;

export function CreateSpecAttributeForm() {
  const [state, formAction, isPending] = useActionState(
    createSpecAttributeFormAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-4" data-testid="create-spec-attribute-form">
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
          placeholder="driver_size_mm"
        />
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
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="Kích thước driver"
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
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="Âm thanh"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="valueType" className="text-sm font-medium text-card-foreground">
            Kiểu giá trị
          </label>
          <select
            id="valueType"
            name="valueType"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="text">Văn bản</option>
            <option value="number">Số</option>
            <option value="boolean">Đúng/sai</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sortOrder" className="text-sm font-medium text-card-foreground">
            Thứ tự trong nhóm
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo thuộc tính"}
        </button>
      </div>
    </form>
  );
}
