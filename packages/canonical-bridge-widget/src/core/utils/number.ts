export const formatNumber = (value: number, decimals = 18) => {
  return value.toLocaleString('fullwide', {
    maximumFractionDigits: decimals,
  });
};
