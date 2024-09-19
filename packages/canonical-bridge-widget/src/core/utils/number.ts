export const formatNumber = (value: number, decimals = 18) => {
  return value.toLocaleString('fullwide', {
    maximumFractionDigits: decimals,
  });
};

export function getMinValueKey(obj: { [key: string]: number }): string {
  return Object.keys(obj).reduce((a, b) => (obj[a] < obj[b] ? a : b));
}

export function getMaxValueKey(obj: { [key: string]: number }): string {
  return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
}
