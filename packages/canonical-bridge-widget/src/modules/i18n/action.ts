import { I18nState } from '@/modules/i18n/reducer';
import { createAction } from '@/modules/store/createAction';

export const updateI18n = createAction<I18nState>('i18n/updateI18n');
