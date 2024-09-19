export function formatTokenUrl(pattern?: string, address?: string) {
  if (!pattern || !address) {
    return '';
  }

  return pattern?.replace('{0}', address);
}
