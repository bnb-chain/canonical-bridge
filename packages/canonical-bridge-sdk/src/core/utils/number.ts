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
