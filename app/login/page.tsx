export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="w-full max-w-[420px] rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-tight">Đăng nhập nội bộ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn có thể dùng email hoặc tên đăng nhập nội bộ.
        </p>
      </section>
    </main>
  );
}
