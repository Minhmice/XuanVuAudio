"use server";

import { revalidatePath } from "next/cache";
import { getInternalUserById, deactivateUser, reactivateUser, updateUserRole } from "@/app/actions/admin";
import type { InternalUserRole } from "@xuanvu/shared/auth/role";

export type UserDetailFormState = {
  error?: string;
} | null;

export async function userDetailFormAction(
  _prevState: UserDetailFormState,
  formData: FormData,
): Promise<UserDetailFormState> {
  const userId = (formData.get("userId") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!userId) return { error: "Người dùng không tồn tại." };

  // Ensure the user exists (nice error message vs SYSTEM_ERROR)
  const existing = await getInternalUserById(userId);
  if (!existing.ok) {
    return { error: existing.error.message };
  }

  if (intent === "updateRole") {
    const role = ((formData.get("role") as string | null) ?? "") as InternalUserRole;
    if (role !== "admin" && role !== "staff") {
      return { error: "Vai trò không hợp lệ." };
    }

    const result = await updateUserRole(userId, role);
    if (!result.ok) return { error: result.error.message };

    revalidatePath(`/admin/users/${userId}`);
    return null;
  }

  if (intent === "deactivate") {
    const result = await deactivateUser(userId);
    if (!result.ok) return { error: result.error.message };

    revalidatePath(`/admin/users/${userId}`);
    return null;
  }

  if (intent === "reactivate") {
    const result = await reactivateUser(userId);
    if (!result.ok) return { error: result.error.message };

    revalidatePath(`/admin/users/${userId}`);
    return null;
  }

  return { error: "Hành động không hợp lệ." };
}

