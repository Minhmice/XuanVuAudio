import Link from "next/link";

import { AppCard, AppCardContent } from "@/components/wrapper/card";

export type PolicyPageData = {
  title: string;
  excerpt: string | null;
  contentMarkdown: string;
};

export function PolicyNotFoundView() {
  return (
    <main className="min-h-screen p-8">
      <AppCard className="mx-auto w-full max-w-3xl">
        <AppCardContent className="p-8 pt-8">
          <p className="text-sm text-destructive" data-testid="policy-not-found">
            Không tìm thấy trang chính sách.
          </p>
          <div className="mt-4">
            <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
              Về trang chủ
            </Link>
          </div>
        </AppCardContent>
      </AppCard>
    </main>
  );
}

export function PolicyPageView({ page }: { page: PolicyPageData }) {
  return (
    <main className="min-h-screen p-8">
      <AppCard className="mx-auto w-full max-w-3xl">
        <AppCardContent className="p-8 pt-8">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{page.title}</h1>
            {page.excerpt ? <p className="mt-2 text-sm text-muted-foreground">{page.excerpt}</p> : null}
          </header>

          <div className="space-y-4 text-sm leading-7 text-card-foreground">
            <div className="whitespace-pre-wrap">{page.contentMarkdown}</div>
          </div>
        </AppCardContent>
      </AppCard>
    </main>
  );
}
