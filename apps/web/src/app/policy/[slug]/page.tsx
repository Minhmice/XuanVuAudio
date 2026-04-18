import { getPublishedPolicyPageBySlug } from "@xuanvu/shared/storefront/policy-page-public";
import { PolicyNotFoundView, PolicyPageView } from "./components/policy-page-view";

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublishedPolicyPageBySlug(slug);

  if (!result.ok) {
    return <PolicyNotFoundView />;
  }

  return <PolicyPageView page={result.data} />;
}
