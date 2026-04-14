export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Bảng điều khiển nội bộ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn đã đăng nhập thành công. Đây là điểm vào mặc định cho hệ thống nội bộ.
        </p>
      </section>
    </main>
  );
}
