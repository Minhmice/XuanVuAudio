export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="rounded-lg border bg-card p-8 text-center text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Xuan Vu Audio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nền tảng nội bộ đã sẵn sàng. Truy cập trang đăng nhập để tiếp tục.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Đi đến đăng nhập
        </a>
      </div>
    </main>
  );
}
