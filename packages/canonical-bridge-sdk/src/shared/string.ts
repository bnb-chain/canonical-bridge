export function utf8ToHex(utf8Str: any) {
  return Array.from(utf8Str)
    .map((char: any) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function capitalizeFirst(text: string) {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
