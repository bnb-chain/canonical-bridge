export type Validation = {
  isValid: boolean;
  errors?: JSX.Element[];
  state?: {
    decimals: boolean;
    isValid: boolean;
    maximum: boolean;
    minimum: boolean;
    number: boolean;
    zero: boolean;
  };
};
