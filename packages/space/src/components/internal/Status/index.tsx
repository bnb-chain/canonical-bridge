import { CloseIcon, InfoIcon, TickIcon, WarningIcon } from '@bnb-chain/icons';

import { theme } from '../../../modules/theme';

export const STATUSES = ['info', 'success', 'warning', 'danger'] as const;
export type Status = typeof STATUSES[number];

export const STATUSES_TO_COLOR_SCHEME: { [key in Status]: keyof typeof theme.colors.dark.support } =
  {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
  } as const;

export const STATUSES_TO_ICON: { [key in Status]: React.ReactNode } = {
  info: <InfoIcon />,
  success: <TickIcon />,
  warning: <WarningIcon />,
  danger: <CloseIcon />,
} as const;
