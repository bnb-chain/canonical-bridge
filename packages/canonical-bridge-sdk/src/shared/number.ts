export function removeAfterDecimals(num: string | number, decimals = 8) {
  const numStr = formatSmallNumber(Number(num));

  // Split the number into the whole and fractional parts
  const parts = numStr.split('.');

  if (parts.length < 2) return num;
  // Slice the fractional part to digits and combine with the whole part
  const fractionalPart = parts[1].slice(0, decimals);
  const result = parts[0] + '.' + fractionalPart;

  return result;
}

export const formatNumber = (
  value: number,
  decimals = 18,
  useGrouping = true
) => {
  const num = removeAfterDecimals(value, decimals);
  return Number(num).toLocaleString('fullwide', {
    maximumFractionDigits: decimals,
    useGrouping,
  });
};

export const formatSmallNumber = (x: number) => {
  let ret = x.toString();
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1]);
    // const num = Number(x.toString().split('e-')[0]);
    if (e) {
      x *= Math.pow(10, e - 1);
      ret = '0.' + new Array(e).join('0') + x.toString().substring(2);
      // x = num / Math.pow(10, e - 1);
      // ret = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      ret = x.toString();
      ret += new Array(e + 1).join('0');
    }
  }
  return ret;
};
