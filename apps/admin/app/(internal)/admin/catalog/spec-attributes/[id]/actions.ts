"use server";

import { redirect } from "next/navigation";

import { updateSpecAttribute } from "@/app/actions/spec-attribute-definitions";

export type SpecAttributeDetailFormState = {
  error?: string;
} | null;

export async function updateSpecAttributeFormAction(
  id: string,
  _prevState: SpecAttributeDetailFormState,
  formData: FormData,
): Promise<SpecAttributeDetailFormState> {
  const labelVi = (formData.get("labelVi") as string | null)?.trim() ?? "";
  const groupName = (formData.get("groupName") as string | null)?.trim() ?? "";
  const sortOrderRaw = (formData.get("sortOrder") as string | null)?.trim() ?? "0";
  const isActive = formData.get("isActive") === "on";

  if (!labelVi || !groupName) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const sortOrder = Number(sortOrderRaw);
  if (!Number.isFinite(sortOrder)) {
    return { error: "Thứ tự không hợp lệ." };
  }

  const result = await updateSpecAttribute(id, {
    labelVi,
    groupName,
    sortOrder,
    isActive,
  });

  if (!result.ok) {
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền thực hiện hành động này." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    if (result.error.code === "NOT_FOUND") {
      return { error: result.error.message };
    }
    if (result.error.code === "VALIDATION_ERROR") {
      return { error: result.error.message };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/catalog/spec-attributes");
}
