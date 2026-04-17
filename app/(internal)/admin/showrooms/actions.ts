"use server";

import { revalidatePath } from "next/cache";

import { deleteShowroom } from "@/app/actions/showrooms";

export async function deleteShowroomAction(formData: FormData): Promise<void> {
  const id = (formData.get("id") as string | null) ?? "";

  if (!id) return;

  await deleteShowroom(id);
  revalidatePath("/admin/showrooms");
}

