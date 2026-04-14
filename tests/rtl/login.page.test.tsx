import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SignInResult } from "@/app/actions/auth";
import LoginPage from "@/app/(auth)/login/page";

let mockedActionState: SignInResult | null = null;

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(() => [mockedActionState, vi.fn()]),
  };
});

vi.mock("@/app/actions/auth", () => ({
  signInWithState: vi.fn(),
}));

beforeEach(() => {
  mockedActionState = null;
});

afterEach(() => {
  cleanup();
});

describe("login page", () => {
  it("renders the exact Phase 1 UI copy", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Đăng nhập nội bộ" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email hoặc tên đăng nhập")).toHaveAttribute(
      "placeholder",
      "nhap@email.com hoặc ten.dang.nhap",
    );
    expect(
      screen.getByText("Bạn có thể dùng email hoặc tên đăng nhập nội bộ."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Mật khẩu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đăng nhập" })).toBeInTheDocument();
    expect(screen.getByText("Cần hỗ trợ?")).toBeInTheDocument();
    expect(
      screen.getByText("Quên mật khẩu: Liên hệ quản trị viên để được đặt lại mật khẩu."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tài khoản bị khóa/vô hiệu hóa: Liên hệ quản trị viên để kiểm tra trạng thái."),
    ).toBeInTheDocument();
  });

  it("associates remember-me checkbox with its label", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Ghi nhớ đăng nhập")).toHaveAttribute("type", "checkbox");
    expect(
      screen.getByText("Dùng trên thiết bị cá nhân. Không bật trên máy dùng chung."),
    ).toBeInTheDocument();
  });

  it("shows inline alert above CTA when the action returns an auth error", async () => {
    mockedActionState = {
      ok: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
      },
    };

    render(<LoginPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
    );
  });
});
