"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signInWithState, type SignInResult } from "@/app/actions/auth";

const INITIAL_STATE: SignInResult | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Đang đăng nhập…" : "Đăng nhập"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signInWithState, INITIAL_STATE);
  const hasError = state?.ok === false;
  const isValidationError = hasError && state.error.code === "VALIDATION_ERROR";

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="w-full max-w-[420px] rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-tight">Đăng nhập nội bộ</h1>

        <form action={formAction} className="mt-6 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-sm font-semibold">
              Email hoặc tên đăng nhập
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="nhap@email.com hoặc ten.dang.nhap"
              aria-describedby="identifier-help identifier-error"
              aria-invalid={Boolean(hasError && state.error.fieldErrors?.identifier)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-ring/50 transition focus-visible:ring-2"
              required
            />
            <p id="identifier-help" className="text-sm text-muted-foreground">
              Bạn có thể dùng email hoặc tên đăng nhập nội bộ.
            </p>
            {hasError && state.error.fieldErrors?.identifier ? (
              <p id="identifier-error" className="text-sm text-destructive">
                {state.error.fieldErrors.identifier}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-semibold">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-describedby="password-error"
              aria-invalid={Boolean(hasError && state.error.fieldErrors?.password)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-ring/50 transition focus-visible:ring-2"
              required
            />
            {hasError && state.error.fieldErrors?.password ? (
              <p id="password-error" className="text-sm text-destructive">
                {state.error.fieldErrors.password}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                value="on"
                className="size-4 rounded border border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <label htmlFor="rememberMe" className="text-sm font-medium">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Dùng trên thiết bị cá nhân. Không bật trên máy dùng chung.
            </p>
          </div>

          {hasError && !isValidationError ? (
            <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error.message}
            </div>
          ) : null}

          <SubmitButton />
        </form>

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Cần hỗ trợ?</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Quên mật khẩu: Liên hệ quản trị viên để được đặt lại mật khẩu.</li>
            <li>Tài khoản bị khóa/vô hiệu hóa: Liên hệ quản trị viên để kiểm tra trạng thái.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
