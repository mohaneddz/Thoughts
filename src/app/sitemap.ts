import type { MetadataRoute } from 'next';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { learnData } from '@/data/learn';
import { reflectionToolsData } from '@/data/reflectionTools';
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

  const articlePaths = learnData.map((article) => routes.article(article.id));
  const toolPaths = reflectionToolsData.map((tool) => routes.tool(tool.id));

  return [...staticPaths, ...testPaths, ...articlePaths, ...toolPaths].map((path) => ({ url: `${siteConfig.url}${path}` }));
}
