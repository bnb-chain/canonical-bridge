export function utf8ToHex(utf8Str: any) {
  return Array.from(utf8Str)
    .map((char: any) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}
