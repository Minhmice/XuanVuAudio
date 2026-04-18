"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getShowroomById, updateShowroom, deleteShowroom } from "@/app/actions/showrooms";

export type ShowroomDetailFormState = {
  error?: string;
} | null;

export async function showroomDetailFormAction(
  _prevState: ShowroomDetailFormState,
  formData: FormData,
): Promise<ShowroomDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Showroom không tồn tại." };

  const existing = await getShowroomById(id);
  if (!existing.ok) {
    return { error: existing.error.message };
  }

  if (intent === "update") {
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const address = (formData.get("address") as string | null)?.trim() ?? "";
    const phone = (formData.get("phone") as string | null)?.trim() ?? "";

    if (!name || !address || !phone) {
      return { error: "Vui lòng điền đầy đủ thông tin." };
    }

    const result = await updateShowroom(id, { name, address, phone });
    if (!result.ok) {
      if (result.error.code === "CONFLICT") return { error: "Showroom đã tồn tại." };
      return { error: result.error.message };
    }

    revalidatePath(`/admin/showrooms/${id}`);
    return null;
  }

  if (intent === "delete") {
    const result = await deleteShowroom(id);
    if (!result.ok) return { error: result.error.message };

    revalidatePath("/admin/showrooms");
    redirect("/admin/showrooms");
  }

  return { error: "Hành động không hợp lệ." };
}

