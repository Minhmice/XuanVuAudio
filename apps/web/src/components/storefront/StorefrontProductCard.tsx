import Link from "next/link";

import type { HomeProduct } from "@xuanvu/shared/storefront/homepage";
import { AppCard, AppCardContent } from "@/components/wrapper/card";

export function formatVnd(n: number | null): string {
  if (n == null) return "Giá liên hệ";
  return `${new Intl.NumberFormat("vi-VN").format(n)} ₫`;
}

export function StorefrontProductCard({ product }: { product: HomeProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <AppCard className="h-full transition hover:border-primary/40">
        <AppCardContent className="p-3 pt-3">
          <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Ảnh</div>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
          {product.brandName ? <p className="mt-0.5 text-xs text-muted-foreground">{product.brandName}</p> : null}
          <p className="mt-2 text-sm font-semibold text-primary">{formatVnd(product.priceSellingVnd)}</p>
          {product.availabilityLabelVi ? (
            <p className="mt-1 text-xs text-muted-foreground" data-testid="product-availability">
              {product.availabilityLabelVi}
            </p>
          ) : null}
        </AppCardContent>
      </AppCard>
    </Link>
  );
}
