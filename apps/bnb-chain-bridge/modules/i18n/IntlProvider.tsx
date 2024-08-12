import React, { useMemo } from 'react';
import { IntlProvider as ReactIntlProvider } from '@bnb-chain/space';

import { useAppSelector } from '@/core/store/hooks';

export type IntlProviderProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
};

export const IntlProvider = ({ children, locale, messages }: IntlProviderProps) => {
  const commonMessages = useAppSelector((state) => state.i18n.messages);

  const _messages = useMemo(() => {
    return {
      ...commonMessages,
      ...messages,
    };
  }, [commonMessages, messages]);

  return (
    <ReactIntlProvider locale={locale} messages={_messages}>
      {children}
    </ReactIntlProvider>
  );
};
