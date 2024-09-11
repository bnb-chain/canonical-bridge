import { createAction } from '@/modules/store/createAction';
import { ThemeState } from '@/core/theme/reducer';

export const setThemeConfig = createAction<ThemeState['themeConfig']>('theme/themeConfig');
