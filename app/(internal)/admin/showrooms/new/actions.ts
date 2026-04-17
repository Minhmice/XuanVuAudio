"use server";

import { redirect } from "next/navigation";

import { createShowroom } from "@/app/actions/showrooms";

export type CreateShowroomFormState = {
  error?: string;
} | null;

export async function createShowroomFormAction(
  _prevState: CreateShowroomFormState,
  formData: FormData,
): Promise<CreateShowroomFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";

  if (!name || !address || !phone) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const result = await createShowroom({ name, address, phone });

  if (!result.ok) {
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền tạo showroom." };
    }
    if (result.error.code === "CONFLICT") {
      return { error: "Showroom đã tồn tại." };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/showrooms");
}

