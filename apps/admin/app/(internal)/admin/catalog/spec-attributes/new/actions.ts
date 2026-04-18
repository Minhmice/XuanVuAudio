"use server";

import { redirect } from "next/navigation";

import { createSpecAttribute } from "@/app/actions/spec-attribute-definitions";

export type CreateSpecAttributeFormState = {
  error?: string;
} | null;

export async function createSpecAttributeFormAction(
  _prevState: CreateSpecAttributeFormState,
  formData: FormData,
): Promise<CreateSpecAttributeFormState> {
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const labelVi = (formData.get("labelVi") as string | null)?.trim() ?? "";
  const groupName = (formData.get("groupName") as string | null)?.trim() ?? "";
  const valueTypeRaw = (formData.get("valueType") as string | null)?.trim() ?? "";
  const sortOrderRaw = (formData.get("sortOrder") as string | null)?.trim() ?? "0";

  if (!slug || !labelVi || !groupName) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  if (valueTypeRaw !== "text" && valueTypeRaw !== "number" && valueTypeRaw !== "boolean") {
    return { error: "Kiểu giá trị không hợp lệ." };
  }

  const sortOrder = Number(sortOrderRaw);
  if (!Number.isFinite(sortOrder)) {
    return { error: "Thứ tự không hợp lệ." };
  }

  const result = await createSpecAttribute({
    slug,
    labelVi,
    groupName,
    valueType: valueTypeRaw,
    sortOrder,
  });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Slug đã tồn tại." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền thực hiện hành động này." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    if (result.error.code === "VALIDATION_ERROR") {
      return { error: result.error.message };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/catalog/spec-attributes");
}
