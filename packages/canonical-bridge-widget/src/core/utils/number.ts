export const formatNumber = (value: number, decimals = 18) => {
  return value.toLocaleString('fullwide', {
    maximumFractionDigits: decimals,
  });
};

export function getMinValueKey(obj: { [key: string]: number }): string {
  if (Object.keys(obj).length === 0) return '';
  return Object.keys(obj).reduce((a, b) => (obj[a] < obj[b] ? a : b));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMaxValueKey(obj: { [key: string]: any }): string {
  if (Object.keys(obj).length === 0) return '';
  return Object.keys(obj).reduce((a, b) => {
    if (obj[a].isSorting !== obj[b].isSorting) {
      return obj[a].isSorting === true ? a : b;
    }
    return obj[a].value > obj[b].value ? a : b;
  });
}

export function removeAfterDecimals(num: string | number, decimals = 8) {
  const numStr = num.toString();

  // Split the number into the whole and fractional parts
  const parts = numStr.split('.');

  if (parts.length < 2) return num;
  // Slice the fractional part to digits and combine with the whole part
  const fractionalPart = parts[1].slice(0, decimals);
  const result = parts[0] + '.' + fractionalPart;

  return parseFloat(result);
}
