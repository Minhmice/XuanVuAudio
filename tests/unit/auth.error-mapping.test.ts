import { describe, expect, it } from "vitest";

const uiCopy = {
  validation: {
    missingIdentifier: "Vui lòng nhập email hoặc tên đăng nhập.",
    missingPassword: "Vui lòng nhập mật khẩu.",
  },
  invalidCredentials: "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
  accountState: {
    locked: "Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên.",
    deactivated: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
  },
  system: "Không thể đăng nhập lúc này. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
} as const;

describe("uiCopy taxonomy contract placeholder", () => {
  it("exposes generic invalid-credentials copy", () => {
    expect(uiCopy.invalidCredentials).toBe(
      "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
    );
  });

  it("exposes specific account-state messages", () => {
    expect(uiCopy.accountState.locked).toContain("bị khóa");
    expect(uiCopy.accountState.deactivated).toContain("vô hiệu hóa");
  });
});
