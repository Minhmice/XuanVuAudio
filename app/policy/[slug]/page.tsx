import Link from "next/link";

import { getPublishedPolicyPageBySlug } from "@/app/actions/policy-pages";

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublishedPolicyPageBySlug(slug);

  if (!result.ok) {
    return (
      <main className="min-h-screen p-8">
        <section className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm text-destructive" data-testid="policy-not-found">
            Không tìm thấy trang chính sách.
          </p>
          <div className="mt-4">
            <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
              Về trang chủ
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const page = result.data;

  return (
    <main className="min-h-screen p-8">
      <article className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{page.title}</h1>
          {page.excerpt && <p className="mt-2 text-sm text-muted-foreground">{page.excerpt}</p>}
        </header>

        <div className="space-y-4 text-sm leading-7 text-card-foreground">
          <div className="whitespace-pre-wrap">{page.contentMarkdown}</div>
        </div>
      </article>
    </main>
  );
}

