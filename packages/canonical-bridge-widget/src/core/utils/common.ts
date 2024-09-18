export function differenceSet<T>(setA: Set<T>, setB: Set<T>) {
  return new Set([...setA].filter((e) => !setB.has(e)));
}

export function intersectionSet<T>(setA: Set<T>, setB: Set<T>) {
  return new Set([...setA].filter((e) => setB.has(e)));
}
