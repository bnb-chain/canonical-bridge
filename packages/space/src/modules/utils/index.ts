export const formatTruncatedString = ({
  value,
  maxCharsPerSide = 4,
}: {
  value: string;
  maxCharsPerSide?: number;
}) => {
  if (value.length < maxCharsPerSide * 2 + 1) return value;

  return (
    value.substring(0, maxCharsPerSide) + '...' + value.substring(value.length - maxCharsPerSide)
  );
};

export const formatAddress = ({ value }: { value: string | `0x${string}` }) => {
  const address = value.replace('0x', '');
  return '0x' + formatTruncatedString({ value: address, maxCharsPerSide: 4 });
};
