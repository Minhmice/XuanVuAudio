import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageShell } from "@/components/wrapper/page-shell";
import type { ProductDetailPayload } from "@xuanvu/shared/storefront/product-detail";
import { ProductBuyBox } from "./product-buy-box";
import { ProductGallery } from "./product-gallery";
import { ProductSpecsTable } from "./product-specs-table";
import { RelatedProductsSection } from "./related-products-section";

export function ProductDetailView({ product }: { product: ProductDetailPayload }) {
  return (
    <PageShell>
      <div className="space-y-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            {product.categorySlug && product.categoryName ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/categories/${product.categorySlug}`}>{product.categoryName}</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <ProductGallery imageUrls={product.imageUrls} />
          <ProductBuyBox product={product} />
        </div>

        {product.description ? (
          <section>
            <h2 className="text-lg font-semibold">Mô tả</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </section>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold">Thông số</h2>
          <div className="mt-4">
            <ProductSpecsTable specs={product.specs} />
          </div>
        </section>

        <RelatedProductsSection products={product.relatedProducts} />
      </div>
    </PageShell>
  );
}
