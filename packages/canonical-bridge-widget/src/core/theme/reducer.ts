import { createReducer } from '@/modules/store/createReducer';
import * as actions from '@/core/theme/action';
import { ColorType, ThemeConfig } from '@/core/theme/colors/types';

export interface ThemeState {
  themeConfig: { colors: ThemeConfig };
}

const initialState: ThemeState = {
  themeConfig: {
    colors: {
      dark: {} as ColorType,
      light: {} as ColorType,
    },
  },
};

export default createReducer(initialState, (builder) => {
  builder.addCase(actions.setThemeConfig, (state, { payload }) => ({
    ...state,
    themeConfig: payload,
  }));
});
