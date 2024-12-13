import { MIN_FEE } from '@/core/constants';
import { formatNumber } from '@/core/utils/number';

export function truncateStr(str: string, headLen = 6, tailLen = 6) {
  if (!str) {
    return '';
  }
  const head = str.substring(0, headLen);
  const tail = str.substring(str.length - tailLen, str.length);

  if (str.length > head.length + tail.length) {
    return `${head}...${tail}`;
  }

  return str;
}

export function truncateHash(hash: string, headLen = 6, tailLen = 4) {
  return truncateStr(hash, headLen, tailLen);
}

export function toObject(value: any) {
  return JSON.parse(
    JSON.stringify(
      value,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    ),
  );
}

export function formatTokenUrl(pattern?: string, address?: string) {
  if (!pattern || !address) {
    return '';
  }

  return pattern?.replace('{0}', address);
}

export function formatFeeAmount(amount: string | number) {
  if (Number(amount) < MIN_FEE && Number(amount) !== 0) {
    return `< ${MIN_FEE}`;
  } else {
    return formatNumber(Number(amount), 4);
  }
}

export function utf8ToHex(utf8Str: any) {
  return Array.from(utf8Str)
    .map((char: any) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function includesIgnoreCase(strArr: string[], target: string) {
  return !!strArr?.find((e) => e.toUpperCase() === target?.toUpperCase());
}
