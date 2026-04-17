"use client";

import { useActionState } from "react";

import type { ProductStatus } from "@/app/actions/products";
import { productDetailFormAction } from "./actions";
import type { ProductDetailFormState } from "./actions";

const INITIAL_STATE: ProductDetailFormState = null;

type Option = { id: string; name: string };

export function ProductDetailForm(props: {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string | null;
  status: ProductStatus;
  imageUrls: string[];
  isPublished: boolean;
  brands: Option[];
  categories: Option[];
}) {
  const [state, formAction, isPending] = useActionState(productDetailFormAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" data-testid="product-detail-form">
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
          Tên sản phẩm
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="brandId" className="text-sm font-medium text-card-foreground">
            Thương hiệu
          </label>
          <select
            id="brandId"
            name="brandId"
            required
            defaultValue={props.brandId}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
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
            defaultValue={props.categoryId}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
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
          defaultValue={props.status}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          defaultValue={props.description ?? ""}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          defaultValue={props.imageUrls.join("\n")}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://...&#10;https://..."
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
            Ẩn sản phẩm
          </button>
        ) : (
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={isPending}
            className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent disabled:opacity-50"
          >
            Hiển thị sản phẩm
          </button>
        )}

        <button
          type="submit"
          name="intent"
          value="delete"
          disabled={isPending}
          className="inline-flex items-center rounded-md border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          Xóa sản phẩm
        </button>
      </div>
    </form>
  );
}

