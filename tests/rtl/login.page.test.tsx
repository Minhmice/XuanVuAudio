import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function LoginPlaceholder() {
  return (
    <main>
      <h1>Đăng nhập nội bộ</h1>
      <button type="button">Đăng nhập</button>
    </main>
  );
}

describe("login placeholder test harness", () => {
  it("renders and supports jest-dom matchers", () => {
    render(<LoginPlaceholder />);

    expect(
      screen.getByRole("heading", { name: "Đăng nhập nội bộ" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đăng nhập" })).toBeInTheDocument();
  });
});
