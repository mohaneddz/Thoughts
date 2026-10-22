export function imageForTest(slug: string): string {
  const aliases: Record<string, string> = {
    'ipip-big-five-50': 'ipip-big-five',
    'ipip-big-five-100': 'ipip-big-five',
    'ipip-neo-120': 'ipip-neo',
    'ipip-neo-300': 'ipip-neo',
    'phq-9': 'phq',
    'phq-8': 'phq',
    'phq-2': 'phq',
    'gad-7': 'gad',
    'gad-2': 'gad',
    'dass-21': 'dass',
    'dass-42': 'dass',
    'pss-10': 'pss-perceived-stress-scale',
    'rosenberg-self-esteem': 'rosenberg-self-esteem-scale',
    'who-5': 'who-5-well-being-index',
    'pcl-5': 'pcl-5-ptsd-checklist',
    'c-ssrs': 'c-ssrs-columbia-suicide-severity-rating-scale',
    mdq: 'mdq-mood-disorder-questionnaire',
    'audit-c': 'audit',
  };

  const coverSlug = aliases[slug] ?? slug;

  return `/images/tests/covers/${coverSlug}.avif`;
}
