import { CommonState } from '@/modules/common/reducer';
import { createAction } from '@/modules/store/createAction';

export const setFooterMenus = createAction<CommonState['footerMenus']>('common/setFooterMenus');
