import Big from 'big.js';
import { FormattedMessage } from 'react-intl';

import { Validation } from '../types';

type Params = {
  value: string;
  token: { symbol: string; decimals: number };
  decimals?: number;
  minimum?: string;
  maximum?: string;
  canBeZero?: boolean;
};

type ValidateState = Pick<Validation, 'isValid'> & {
  number: boolean;
  decimals: boolean;
  minimum: boolean;
  maximum: boolean;
  zero: boolean;
};

const validate = ({ value, decimals, minimum, maximum, canBeZero }: Params): ValidateState => {
  const res = {
    number: false,
    decimals: false,
    minimum: false,
    maximum: false,
    zero: false,
  };

  if (!value) {
    return { ...res, isValid: false };
  }

  try {
    const amount = Big(value);

    res.number = true;
    res.minimum = !!minimum ? amount.gte(minimum) : true;
    res.maximum = !!maximum ? amount.lte(maximum) : true;
    res.zero = !canBeZero ? amount.gt(0) : true;

    const decimalIndex = value.indexOf('.');
    const decimal = decimalIndex !== -1 ? value.substring(decimalIndex + 1) : undefined;
    res.decimals = !!decimals ? (!!decimal ? decimal.length <= decimals : true) : true;
  } catch {
  } finally {
    return {
      ...res,
      isValid: Object.values(res).every((it) => !!it),
    };
  }
};

export const useValidateTokenAmount = () => {
  return (params: Params): Validation => {
    const state = validate(params);

    const errors: JSX.Element[] = [];

    if (!state.number) {
      errors.push(<FormattedMessage id="validate-token-amount.generic" />);
    }
    if (!state.decimals) {
      errors.push(
        <FormattedMessage
          id="validate-token-amount.decimals"
          values={{ number: params.decimals }}
        />,
      );
    }
    if (!state.zero) {
      errors.push(<FormattedMessage id="validate-token-amount.zero" />);
    }
    if (!state.minimum) {
      errors.push(
        <FormattedMessage id="validate-token-amount.minimum" values={{ number: params.minimum }} />,
      );
    }
    if (!state.maximum) {
      errors.push(
        <FormattedMessage
          id="validate-token-amount.maximum"
          values={{ token: params.token.symbol }}
        />,
      );
    }

    return { isValid: state.isValid, errors, state };
  };
};
