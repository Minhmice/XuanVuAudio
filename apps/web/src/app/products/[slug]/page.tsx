import { notFound } from "next/navigation";

import { fetchProductDetailBySlug } from "@xuanvu/shared/storefront/product-detail";
import { ProductDetailView } from "./components/product-detail-view";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await fetchProductDetailBySlug(slug);
  if (!detail) notFound();
  return <ProductDetailView product={detail} />;
}
