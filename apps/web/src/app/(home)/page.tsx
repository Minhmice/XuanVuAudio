import { loadHomepageData, loadPublishedCategoryNav } from "@xuanvu/shared/storefront/homepage";

import { HomePageView } from "./components/home-page-view";

export default async function Page() {
  const [data, categoryNav] = await Promise.all([loadHomepageData(), loadPublishedCategoryNav()]);
  return <HomePageView data={data} categoryNav={categoryNav} />;
}
