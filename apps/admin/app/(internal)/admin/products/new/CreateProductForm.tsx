"use client";

import { useActionState } from "react";

import type { ProductStatus } from "@/app/actions/products";
import { createProductFormAction } from "./actions";
import type { CreateProductFormState } from "./actions";

const INITIAL_STATE: CreateProductFormState = null;

type Option = { id: string; name: string };

export function CreateProductForm(props: { brands: Option[]; categories: Option[] }) {
  const [state, formAction, isPending] = useActionState(createProductFormAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" data-testid="create-product-form">
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
          Tên sản phẩm
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
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
          autoComplete="off"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="brandId" className="text-sm font-medium text-card-foreground">
            Thương hiệu
          </label>
          <select
            id="brandId"
            name="brandId"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            defaultValue=""
          >
            <option value="" disabled>
              Chọn thương hiệu
            </option>
            {props.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-medium text-card-foreground">
            Danh mục
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            defaultValue=""
          >
            <option value="" disabled>
              Chọn danh mục
            </option>
            {props.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="status" className="text-sm font-medium text-card-foreground">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          defaultValue={"active" satisfies ProductStatus}
        >
          <option value="active">Đang bán</option>
          <option value="inactive">Tạm ngừng</option>
          <option value="archived">Ngừng kinh doanh</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-card-foreground">
          Mô tả (tùy chọn)
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="imageUrls" className="text-sm font-medium text-card-foreground">
          Ảnh (tối đa 12, mỗi dòng 1 URL)
        </label>
        <textarea
          id="imageUrls"
          name="imageUrls"
          rows={6}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          placeholder="https://...&#10;https://..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang tạo..." : "Tạo sản phẩm"}
        </button>
      </div>
    </form>
  );
}

