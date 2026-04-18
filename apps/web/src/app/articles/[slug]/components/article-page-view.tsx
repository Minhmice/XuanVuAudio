import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppCard, AppCardContent } from "@/components/wrapper/card";

export type ArticlePageData = {
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  content: string;
};

export function ArticlePageView({ article }: { article: ArticlePageData }) {
  return (
    <main className="min-h-screen p-8">
      <AppCard className="mx-auto w-full max-w-3xl">
        <AppCardContent className="p-8 pt-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bài viết</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {article.cover_image_url ? (
            <div className="mt-6 mb-6 overflow-hidden rounded-lg border bg-muted">
              <img src={article.cover_image_url} alt="" className="max-h-[360px] w-full object-cover" />
            </div>
          ) : null}

          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{article.title}</h1>
            {article.excerpt ? <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p> : null}
            {article.author_name ? <p className="mt-2 text-xs text-muted-foreground">Tác giả: {article.author_name}</p> : null}
          </header>

          <div className="space-y-4 text-sm leading-7 text-card-foreground">
            <div className="whitespace-pre-wrap">{article.content}</div>
          </div>
        </AppCardContent>
      </AppCard>
    </main>
  );
}
