import type { Metadata } from "next";

import { loadPublishedProductSearch } from "@xuanvu/shared/storefront/product-search";
import { ProductSearchView } from "./components/product-search-view";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm",
  description: "Tìm kiếm tai nghe và thiết bị âm thanh tại Xuan Vu Audio.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qRaw = sp.q;
  const q = Array.isArray(qRaw) ? qRaw[0] : qRaw;
  const { products, normalizedQuery } = await loadPublishedProductSearch(q);

  return <ProductSearchView products={products} normalizedQuery={normalizedQuery} />;
}
