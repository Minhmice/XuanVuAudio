import "server-only";

import {
  availabilityLabelsOrNull,
  fetchStorefrontStockTotals,
} from "./availability";
import { createSupabaseServerClient } from "../supabase/server";

const BRAND_LIMIT = 12;
const PRODUCT_SECTION_LIMIT = 8;
const ARTICLE_LIMIT = 4;
const SHOWROOM_LIMIT = 8;

const POLICY_KEYS_FOR_HOME = ["contact", "delivery", "returns", "warranty"] as const;

export type HomeBrand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
};

export type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  priceSellingVnd: number | null;
  priceCompareAtVnd: number | null;
  brandName: string | null;
  /** Set when storefront stock RPC succeeds; omitted if RPC failed (no misleading badge). */
  availabilityLabelVi?: string;
};

export type HomeArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
};

export type HomeShowroom = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type HomePolicyLink = {
  key: string;
  title: string;
  slug: string;
};

export type HomepageData = {
  brands: HomeBrand[];
  featuredProducts: HomeProduct[];
  newProducts: HomeProduct[];
  recommendedProducts: HomeProduct[];
  articles: HomeArticle[];
  showrooms: HomeShowroom[];
  policyLinks: HomePolicyLink[];
};

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  price_selling_vnd: number | null;
  price_compare_at_vnd: number | null;
  catalog_brands: { name: string; slug: string } | null;
};

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

type ShowroomRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type PolicyRow = {
  key: string;
  title: string;
  slug: string;
};

function mapProduct(row: ProductRow): HomeProduct {
  const urls = row.image_urls;
  const first = Array.isArray(urls) && urls.length > 0 ? urls[0] : null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: first,
    priceSellingVnd: row.price_selling_vnd,
    priceCompareAtVnd: row.price_compare_at_vnd,
    brandName: row.catalog_brands?.name ?? null,
  };
}

function mergeAvailabilityLabels(
  products: HomeProduct[],
  labelMap: Map<string, string> | null,
): HomeProduct[] {
  if (!labelMap) return products;
  return products.map((p) => ({
    ...p,
    availabilityLabelVi: labelMap.get(p.id) ?? p.availabilityLabelVi,
  }));
}

export async function loadHomepageData(): Promise<HomepageData> {
  const supabase = await createSupabaseServerClient();

  const brandsRes = await supabase
    .from("catalog_brands")
    .select("id, name, slug, logo_url")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(BRAND_LIMIT);

  const featuredRes = await supabase
    .from("catalog_products")
    .select(
      "id, name, slug, image_urls, price_selling_vnd, price_compare_at_vnd, catalog_brands(name, slug)",
    )
    .eq("is_published", true)
    .eq("merch_is_featured", true)
    .order("updated_at", { ascending: false })
    .limit(PRODUCT_SECTION_LIMIT);

  const newRes = await supabase
    .from("catalog_products")
    .select(
      "id, name, slug, description, image_urls, price_selling_vnd, price_compare_at_vnd, catalog_brands(name, slug)",
    )
    .eq("is_published", true)
    .order("first_published_at", { ascending: false, nullsFirst: false })
    .limit(PRODUCT_SECTION_LIMIT);

  const recommendedRes = await supabase
    .from("catalog_products")
    .select(
      "id, name, slug, description, image_urls, price_selling_vnd, price_compare_at_vnd, catalog_brands(name, slug)",
    )
    .eq("is_published", true)
    .eq("merch_is_recommended", true)
    .order("updated_at", { ascending: false })
    .limit(PRODUCT_SECTION_LIMIT);

  const articlesRes = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, cover_image_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(ARTICLE_LIMIT);

  const showroomsRes = await supabase
    .from("showrooms")
    .select("id, name, address, phone")
    .order("created_at", { ascending: false })
    .limit(SHOWROOM_LIMIT);

  const policiesRes = await supabase
    .from("policy_pages")
    .select("key, title, slug")
    .eq("is_published", true)
    .in("key", [...POLICY_KEYS_FOR_HOME]);

  const brands: HomeBrand[] = brandsRes.error
    ? []
    : ((brandsRes.data as BrandRow[] | null)?.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        logoUrl: row.logo_url,
      })) ?? []);

  let featuredProducts: HomeProduct[] = featuredRes.error
    ? []
    : (((featuredRes.data as unknown) as ProductRow[] | null)?.map(mapProduct) ?? []);

  let newProducts: HomeProduct[] = newRes.error
    ? []
    : (((newRes.data as unknown) as ProductRow[] | null)?.map(mapProduct) ?? []);

  let recommendedProducts: HomeProduct[] = recommendedRes.error
    ? []
    : (((recommendedRes.data as unknown) as ProductRow[] | null)?.map(mapProduct) ?? []);

  const homeProductIds = [
    ...new Set([
      ...featuredProducts.map((p) => p.id),
      ...newProducts.map((p) => p.id),
      ...recommendedProducts.map((p) => p.id),
    ]),
  ];
  const stockFetch = await fetchStorefrontStockTotals(supabase, homeProductIds);
  const homeLabels = availabilityLabelsOrNull(stockFetch, homeProductIds);
  featuredProducts = mergeAvailabilityLabels(featuredProducts, homeLabels);
  newProducts = mergeAvailabilityLabels(newProducts, homeLabels);
  recommendedProducts = mergeAvailabilityLabels(recommendedProducts, homeLabels);

  const articles: HomeArticle[] = articlesRes.error
    ? []
    : ((articlesRes.data as ArticleRow[] | null)?.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        coverImageUrl: row.cover_image_url,
        publishedAt: row.published_at,
      })) ?? []);

  const showrooms: HomeShowroom[] = showroomsRes.error
    ? []
    : ((showroomsRes.data as ShowroomRow[] | null)?.map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        phone: row.phone,
      })) ?? []);

  const policyRows = policiesRes.error ? [] : ((policiesRes.data as PolicyRow[] | null) ?? []);
  const policyLinks: HomePolicyLink[] = POLICY_KEYS_FOR_HOME.map((key) => {
    const row = policyRows.find((r) => r.key === key);
    if (!row) return null;
    return { key: row.key, title: row.title, slug: row.slug };
  }).filter((x): x is HomePolicyLink => x !== null);

  return {
    brands,
    featuredProducts,
    newProducts,
    recommendedProducts,
    articles,
    showrooms,
    policyLinks,
  };
}

export type CategoryNavItem = { slug: string; name: string };

export async function loadPublishedCategoryNav(): Promise<CategoryNavItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("catalog_categories")
    .select("slug, name")
    .eq("is_published", true)
    .order("name", { ascending: true })
    .limit(24);

  if (error || !data) return [];
  return data as CategoryNavItem[];
}
