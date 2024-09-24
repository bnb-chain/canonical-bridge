import { ColorType } from '@/core/theme/colors/dark';

export const COLOR_SCHEMES = ['primary', 'secondary', 'brand', 'success', 'danger'] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

export type ThemeConfig = {
  light: ColorType;
  dark: ColorType;
};
