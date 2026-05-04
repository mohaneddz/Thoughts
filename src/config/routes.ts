export const routes = {
  home: '/',
  tests: '/tests',
  test: (slug: string) => `/tests/${slug}`,
  result: (id: string) => `/results/${id}`,
  aiInterpreter: '/ai-interpreter',
  checkIn: '/check-in',
  dashboard: '/dashboard',
  reflectionTools: '/reflection-tools',
  collections: '/collections',
  learn: '/learn',
  savedThoughts: '/saved-thoughts',
  privacy: '/privacy',
  about: '/about',
} as const;

