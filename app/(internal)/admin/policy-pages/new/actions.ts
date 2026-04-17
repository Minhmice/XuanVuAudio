"use server";

import { redirect } from "next/navigation";

import { createPolicyPage } from "@/app/actions/policy-pages";

export type CreatePolicyPageFormState = {
  error?: string;
} | null;

export async function createPolicyPageFormAction(
  _prevState: CreatePolicyPageFormState,
  formData: FormData,
): Promise<CreatePolicyPageFormState> {
  const key = (formData.get("key") as string | null)?.trim() ?? "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const excerpt = (formData.get("excerpt") as string | null)?.trim() ?? "";
  const contentMarkdown = (formData.get("contentMarkdown") as string | null)?.trim() ?? "";
  const isPublished = formData.get("isPublished") === "on";

  if (!key || !title || !slug) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const result = await createPolicyPage({
    key,
    title,
    slug,
    excerpt: excerpt ? excerpt : null,
    contentMarkdown,
    isPublished,
  });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") return { error: "Key hoặc slug đã tồn tại." };
    if (result.error.code === "FORBIDDEN") return { error: "Bạn không có quyền tạo trang." };
    if (result.error.code === "UNAUTHENTICATED") return { error: "Vui lòng đăng nhập." };
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/policy-pages");
}

