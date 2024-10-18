export const VARIANTS = ['solid'] as const;
export type Variant = typeof VARIANTS[number];
export const SIZES = ['sm', 'md', 'lg'] as const;
export type Size = typeof SIZES[number];
export const COLOR_SCHEMES = ['primary', 'brand', 'success', 'warning', 'danger'] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

export const DEFAULT_PROPS = {
  variant: 'solid',
  size: 'md',
  colorScheme: 'primary',
} as const;
