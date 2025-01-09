export function isEmpty(obj?: Object) {
  return !obj || Object.entries(obj).length === 0;
}

export function uniqueArr<T = unknown>(arr: T[]) {
  const map = new Map<any, boolean>();
  return arr.filter((item) => {
    if (map.get(item)) {
      return false;
    }
    map.set(item, true);
    return true;
  });
}
