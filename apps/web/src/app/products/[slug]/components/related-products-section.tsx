import type { ProductDetailPayload } from "@xuanvu/shared/storefront/product-detail";
import { StorefrontProductCard } from "@/components/storefront/StorefrontProductCard";

export function RelatedProductsSection({ products }: { products: ProductDetailPayload["relatedProducts"] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-10">
      <h2 className="text-lg font-semibold">Sản phẩm liên quan</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <StorefrontProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
