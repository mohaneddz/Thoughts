import type { MetadataRoute } from 'next';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { testsData } from '@/data/tests';
import { buildTestCatalog } from '@/utils/tests/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    routes.home,
    routes.tests,
    routes.checkIn,
    routes.reflectionTools,
    routes.collections,
    routes.learn,
    routes.about,
    routes.privacy,
  ];

  const testPaths = buildTestCatalog(testsData).flatMap((entry) =>
    entry.variants.filter((variant) => variant.status !== 'pending').map((variant) => routes.test(variant.slug)),
  );

  return [...staticPaths, ...testPaths].map((path) => ({ url: `${siteConfig.url}${path}` }));
}
