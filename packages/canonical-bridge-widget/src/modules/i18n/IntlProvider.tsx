import React from 'react';
import { IntlProvider as ReactIntlProvider } from '@bnb-chain/space';

export type IntlProviderProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
};

export const IntlProvider = ({ children, locale, messages }: IntlProviderProps) => {
  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
};
