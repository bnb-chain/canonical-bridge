import { FormattedMessage } from 'react-intl';

import type { Validation } from '../types';

type Params = { value: string };

type ValidateState = Pick<Validation, 'isValid'> & {
  prefix: boolean;
  url: boolean;
};

const validate = ({ value }: Params): ValidateState => {
  const res = {
    prefix: false,
    url: false,
  };

  if (!value) {
    return { ...res, isValid: false };
  }

  res.prefix = value.startsWith('http:') || value.startsWith('https:');

  try {
    new URL(value);
    res.url = true;
  } catch {
    res.url = false;
  }

  return { ...res, isValid: !Object.entries(res).some(([_, v]) => !v) };
};

export const useValidateURL = () => {
  return (params: Params): Validation => {
    const state = validate(params);

    const errors: JSX.Element[] = [];

    if (!state.prefix) {
      errors.push(<FormattedMessage id="validate-url.prefix" />);
    }
    if (!state.url) {
      errors.push(<FormattedMessage id="validate-url.generic" />);
    }

    return { isValid: state.isValid, errors: errors.length ? errors : undefined };
  };
};
