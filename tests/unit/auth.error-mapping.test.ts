import { describe, expect, it, vi } from "vitest";

import {
  mapAuthFailureToUi,
  normalizeIdentifier,
  resolveIdentifierToEmail,
} from "@/app/lib/auth/identifier";

describe("normalizeIdentifier", () => {
  it("trims and lowercases email identifiers only", () => {
    expect(normalizeIdentifier("  User.Name@Example.COM  ")).toEqual({
      kind: "email",
      value: "user.name@example.com",
    });
  });

  it("trims username identifiers without lowercasing", () => {
    expect(normalizeIdentifier("  Staff.User  ")).toEqual({
      kind: "username",
      value: "Staff.User",
    });
  });
});

describe("mapAuthFailureToUi", () => {
  it("maps identifier missing validation message exactly", () => {
    expect(mapAuthFailureToUi({ kind: "validation", field: "identifier" })).toEqual({
      type: "field",
      code: "validation",
      message: "Vui lòng nhập email hoặc tên đăng nhập.",
    });
  });

  it("maps password missing validation message exactly", () => {
    expect(mapAuthFailureToUi({ kind: "validation", field: "password" })).toEqual({
      type: "field",
      code: "validation",
      message: "Vui lòng nhập mật khẩu.",
    });
  });

  it("maps invalid credentials message exactly", () => {
    expect(mapAuthFailureToUi({ kind: "invalid_credentials" })).toEqual({
      type: "alert",
      code: "invalid_credentials",
      message: "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
    });
  });

  it("maps locked account message exactly", () => {
    expect(mapAuthFailureToUi({ kind: "locked" })).toEqual({
      type: "alert",
      code: "locked",
      message: "Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên.",
    });
  });

  it("maps deactivated account message exactly", () => {
    expect(mapAuthFailureToUi({ kind: "deactivated" })).toEqual({
      type: "alert",
      code: "deactivated",
      message: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
    });
  });

  it("maps system message exactly", () => {
    expect(mapAuthFailureToUi({ kind: "system" })).toEqual({
      type: "alert",
      code: "system",
      message:
        "Không thể đăng nhập lúc này. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
    });
  });
});

describe("resolveIdentifierToEmail", () => {
  it("returns lowercase email directly for email identifier", async () => {
    const result = await resolveIdentifierToEmail({
      identifier: { kind: "email", value: "user@example.com" },
    });

    expect(result).toEqual({ email: "user@example.com" });
  });

  it("resolves username to email from internal_user_profiles", async () => {
    const maybeSingle = vi.fn(async () => ({ data: { email: "staff@example.com" }, error: null }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    const result = await resolveIdentifierToEmail({
      identifier: { kind: "username", value: "staff.user" },
      adminClient: { from },
    });

    expect(from).toHaveBeenCalledWith("internal_user_profiles");
    expect(select).toHaveBeenCalledWith("email");
    expect(eq).toHaveBeenCalledWith("username", "staff.user");
    expect(result).toEqual({ email: "staff@example.com" });
  });

  it("maps unknown username to invalid credentials without oracle", async () => {
    const maybeSingle = vi.fn(async () => ({ data: null, error: null }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    const result = await resolveIdentifierToEmail({
      identifier: { kind: "username", value: "unknown.user" },
      adminClient: { from },
    });

    expect(result).toEqual({ errorCode: "invalid_credentials" });
  });

  it("maps lookup failures to system error", async () => {
    const maybeSingle = vi.fn(async () => ({ data: null, error: { message: "db error" } }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    const result = await resolveIdentifierToEmail({
      identifier: { kind: "username", value: "staff.user" },
      adminClient: { from },
    });

    expect(result).toEqual({ errorCode: "system" });
  });
});
