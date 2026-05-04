export function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateIso));
}

export function readingTime(minutes: number) {
  return `${minutes} min`;
}

