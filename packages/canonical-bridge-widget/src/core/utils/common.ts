export function differenceSet<T>(setA: Set<T>, setB: Set<T>) {
  return new Set([...setA].filter((e) => !setB.has(e)));
}

export function intersectionSet<T>(setA: Set<T>, setB: Set<T>) {
  return new Set([...setA].filter((e) => setB.has(e)));
}

export function openLink(url = '') {
  if (!url) return;
  window.open(url, '_blank', 'noopener noreferrer');
}
