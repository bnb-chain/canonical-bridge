import { useCallback } from 'react';
import { FormattedDate, FormattedMessage, IntlFormatters, useIntl, IntlProvider } from 'react-intl';

/**
 * Use this instead of the default function from `react-intl`.
 * Keep props identical to the original `FormattedMessage`.
 *
 * Don't add complicated `values` in this hook as they're changing too much with the new theme.
 * Just add it in your specific use case.
 */
export const useFormatMessage = (): {
  formatMessage: (
    descriptor: Parameters<IntlFormatters['formatMessage']>[0],
    values?: Parameters<IntlFormatters['formatMessage']>[1],
  ) => React.ReactNode;
} => {
  const { formatMessage: formatMessageBase } = useIntl();

  const formatMessage = useCallback(
    (
      descriptor: Parameters<IntlFormatters['formatMessage']>[0],
      values?: Parameters<IntlFormatters['formatMessage']>[1],
    ) => {
      return formatMessageBase(
        { ...descriptor },
        {
          b: (chunks) => <b>{chunks}</b>,
          br: <br />,
          li: (chunks) => <li>{chunks}</li>,
          p: (chunks) => <p>{chunks}</p>,
          span: (chunks) => <span>{chunks}</span>,
          ...values,
        },
      );
    },
    [formatMessageBase],
  );

  return { formatMessage };
};

export { FormattedDate, FormattedMessage, IntlProvider, useIntl };
