import Link from "next/link";

import {
  listShowroomInventoryAdjustments,
  listShowroomInventoryLines,
} from "@/app/actions/inventory";
import { getShowroomById } from "@/app/actions/showrooms";
import { ShowroomAdjustmentHistory } from "@/components/admin/ShowroomAdjustmentHistory";
import { ShowroomInventoryTable } from "@/components/admin/ShowroomInventoryTable";
import { requireStaffRole } from "@xuanvu/shared/auth/role";

type PageProps = {
  params: Promise<{ showroomId: string }>;
};

export default async function AdminShowroomInventoryPage({ params }: PageProps) {
  const guard = await requireStaffRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
          <p className="text-sm text-destructive" data-testid="forbidden-message">
            Không có quyền truy cập.
          </p>
        </section>
      </main>
    );
  }

  const { showroomId } = await params;

  const [showroomResult, linesResult, adjResult] = await Promise.all([
    getShowroomById(showroomId),
    listShowroomInventoryLines(showroomId),
    listShowroomInventoryAdjustments(showroomId),
  ]);

  if (!showroomResult.ok) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-sm text-destructive">Không tải được showroom.</p>
      </main>
    );
  }

  const showroom = showroomResult.data;
  const lines = linesResult.ok ? linesResult.data : [];
  const adjustments = adjResult.ok ? adjResult.data : [];
  const linesError = !linesResult.ok;
  const adjError = !adjResult.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <Link href="/admin/inventory" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Tất cả showroom
          </Link>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground" data-testid="inventory-showroom-title">
          Tồn kho — {showroom.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{showroom.address}</p>

        {linesError && (
          <p className="mt-4 text-sm text-destructive" data-testid="inventory-lines-error">
            Lỗi tải dòng tồn kho.
          </p>
        )}

        {!linesError && (
          <div className="mt-8">
            <ShowroomInventoryTable showroomId={showroomId} lines={lines} />
          </div>
        )}

        {adjError && (
          <p className="mt-4 text-sm text-destructive">Lỗi tải lịch sử điều chỉnh.</p>
        )}
        {!adjError && <ShowroomAdjustmentHistory items={adjustments} />}
      </section>
    </main>
  );
}
