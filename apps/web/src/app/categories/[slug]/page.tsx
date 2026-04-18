import { notFound } from "next/navigation";

import { loadCategoryListing } from "@xuanvu/shared/storefront/category-listing";
import { CategoryListingView } from "./components/category-listing-view";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const result = await loadCategoryListing(slug, sp);
  if (!result.ok) notFound();
  return <CategoryListingView data={result.data} />;
}
