"use server";

import { redirect } from "next/navigation";
import { createInternalUser } from "@/app/actions/admin";
import type { InternalUserRole } from "@xuanvu/shared/auth/role";

export type CreateUserFormState = {
  error?: string;
} | null;

export async function createUserFormAction(
  _prevState: CreateUserFormState,
  formData: FormData,
): Promise<CreateUserFormState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const role = ((formData.get("role") as string | null) ?? "staff") as InternalUserRole;

  if (!email || !username || !password) {
    return { error: "Vui l\u00f2ng \u0111i\u1ec1n \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin." };
  }

  const result = await createInternalUser(email, username, password, role);

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Email ho\u1eb7c t\u00ean \u0111\u0103ng nh\u1eadp \u0111\u00e3 t\u1ed3n t\u1ea1i." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "B\u1ea1n kh\u00f4ng c\u00f3 quy\u1ec1n t\u1ea1o ng\u01b0\u1eddi d\u00f9ng." };
    }
    return { error: "L\u1ed7i h\u1ec7 th\u1ed1ng. Vui l\u00f2ng th\u1eed l\u1ea1i sau." };
  }

  redirect("/admin/users");
}
