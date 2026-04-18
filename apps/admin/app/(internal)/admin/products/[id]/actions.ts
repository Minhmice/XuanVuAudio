"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { ProductStatus } from "@/app/actions/products";
import {
  deleteProduct,
  getProductById,
  setProductPublished,
  updateProduct,
} from "@/app/actions/products";

export type ProductDetailFormState = {
  error?: string;
} | null;

function parseStatus(raw: string): ProductStatus | null {
  if (raw === "active" || raw === "inactive" || raw === "archived") return raw;
  return null;
}

export async function productDetailFormAction(
  _prevState: ProductDetailFormState,
  formData: FormData,
): Promise<ProductDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Sản phẩm không tồn tại." };

  const existing = await getProductById(id);
  if (!existing.ok) return { error: existing.error.message };

  if (intent === "save") {
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const slug = (formData.get("slug") as string | null)?.trim() ?? "";
    const brandId = (formData.get("brandId") as string | null)?.trim() ?? "";
    const categoryId = (formData.get("categoryId") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null)?.trim() ?? "";
    const statusRaw = (formData.get("status") as string | null)?.trim() ?? "active";
    const imageUrlsRaw = (formData.get("imageUrls") as string | null) ?? "";

    if (!name || !slug || !brandId || !categoryId) {
      return { error: "Vui lòng điền đầy đủ thông tin." };
    }

    const status = parseStatus(statusRaw);
    if (!status) return { error: "Trạng thái không hợp lệ." };

    const imageUrls = imageUrlsRaw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const result = await updateProduct(id, {
      name,
      slug,
      brandId,
      categoryId,
      description: description || null,
      status,
      imageUrls,
    });
    if (!result.ok) return { error: result.error.message };

    revalidatePath(`/admin/products/${id}`);
    return null;
  }

  if (intent === "publish") {
    const result = await setProductPublished(id, true);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/products/${id}`);
    return null;
  }

  if (intent === "unpublish") {
    const result = await setProductPublished(id, false);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/products/${id}`);
    return null;
  }

  if (intent === "delete") {
    const result = await deleteProduct(id);
    if (!result.ok) return { error: result.error.message };
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }

  return { error: "Hành động không hợp lệ." };
}

