import { FormattedMessage } from 'react-intl';

import { Validation } from '../types';

type Params = {
  value: string;
};

type ValidateState = Pick<Validation, 'isValid'>;

const validate = ({ value }: Params): ValidateState => {
  return { isValid: !!value };
};

export const useValidateNotEmpty = () => {
  return (params: Params): Validation => {
    const state = validate(params);

    const errors: JSX.Element[] = [];

    if (!state.isValid) {
      errors.push(<FormattedMessage id="validate-not-empty.generic" />);
    }

    return { isValid: state.isValid, errors };
  };
};
