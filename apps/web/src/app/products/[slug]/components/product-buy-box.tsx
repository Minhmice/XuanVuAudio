import type { ProductDetailPayload } from "@xuanvu/shared/storefront/product-detail";
import { AppButton } from "@/components/wrapper/button";
import { AppCard, AppCardContent } from "@/components/wrapper/card";
import { formatVnd } from "@/components/storefront/StorefrontProductCard";

export function ProductBuyBox({ product }: { product: ProductDetailPayload }) {
  return (
    <AppCard>
      <AppCardContent className="p-6 pt-6">
        {product.brandName ? <p className="text-sm text-muted-foreground">{product.brandName}</p> : null}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
        <div className="mt-4 space-y-1">
          <p className="text-2xl font-semibold text-primary">{formatVnd(product.priceSellingVnd)}</p>
          {product.priceCompareAtVnd != null && product.priceCompareAtVnd > 0 ? (
            <p className="text-sm text-muted-foreground line-through">{formatVnd(product.priceCompareAtVnd)}</p>
          ) : null}
        </div>
        {product.availabilityLabelVi ? (
          <p className="mt-3 text-sm text-muted-foreground" data-testid="pdp-availability">
            Tình trạng: <span className="text-foreground">{product.availabilityLabelVi}</span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <AppButton type="button" disabled className="normal-case tracking-normal font-medium opacity-60" title="Sắp có (giỏ hàng)">
            Thêm vào giỏ
          </AppButton>
          <AppButton type="button" variant="outline" disabled className="normal-case tracking-normal font-medium opacity-60" title="Sắp có (mua nhanh)">
            Mua nhanh
          </AppButton>
        </div>
      </AppCardContent>
    </AppCard>
  );
}
