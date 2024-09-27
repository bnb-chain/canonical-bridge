import { createAction } from '@reduxjs/toolkit';

import { I18nState } from '@/modules/i18n/reducer';

export const updateI18n = createAction<I18nState>('i18n/updateI18n');
