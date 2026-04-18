import { notFound } from "next/navigation";

import { ArticlePageView } from "./components/article-page-view";
import { loadPublishedArticleBySlug } from "./data/load-article";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await loadPublishedArticleBySlug(slug);

  if (!article) notFound();

  return <ArticlePageView article={article} />;
}
