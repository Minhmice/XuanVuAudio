"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deletePolicyPage,
  getPolicyPageById,
  updatePolicyPage,
} from "@/app/actions/policy-pages";

export type PolicyPageDetailFormState = {
  error?: string;
} | null;

export async function policyPageDetailFormAction(
  _prevState: PolicyPageDetailFormState,
  formData: FormData,
): Promise<PolicyPageDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Trang chính sách không tồn tại." };

  const existing = await getPolicyPageById(id);
  if (!existing.ok) return { error: existing.error.message };

  if (intent === "update") {
    const key = (formData.get("key") as string | null)?.trim() ?? "";
    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const slug = (formData.get("slug") as string | null)?.trim() ?? "";
    const excerpt = (formData.get("excerpt") as string | null)?.trim() ?? "";
    const contentMarkdown = (formData.get("contentMarkdown") as string | null)?.trim() ?? "";
    const isPublished = formData.get("isPublished") === "on";

    if (!key || !title || !slug) return { error: "Vui lòng điền đầy đủ thông tin." };

    const result = await updatePolicyPage(id, {
      key,
      title,
      slug,
      excerpt: excerpt ? excerpt : null,
      contentMarkdown,
      isPublished,
    });

    if (!result.ok) {
      if (result.error.code === "CONFLICT") return { error: "Key hoặc slug đã tồn tại." };
      return { error: result.error.message };
    }

    revalidatePath(`/admin/policy-pages/${id}`);
    return null;
  }

  if (intent === "delete") {
    const result = await deletePolicyPage(id);
    if (!result.ok) return { error: result.error.message };

    revalidatePath("/admin/policy-pages");
    redirect("/admin/policy-pages");
  }

  return { error: "Hành động không hợp lệ." };
}

