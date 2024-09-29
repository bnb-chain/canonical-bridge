import React from 'react';
import { IntlProvider as ReactIntlProvider } from '@bnb-chain/space';

import { useAppSelector } from '@/core/store/hooks';

export const IntlProvider = ({ children }: React.PropsWithChildren) => {
  const messages = useAppSelector((state) => state.i18n.messages);
  const locale = useAppSelector((state) => state.i18n.locale);

  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
};
