export const VARIANTS = ['solid', 'subtle', 'left-accent', 'top-accent', 'bottom-accent'] as const;
export type Variant = typeof VARIANTS[number];

export const DEFAULT_PROPS = {
  variant: 'solid',
} as const;
