import { ResponsiveValue, TextProps } from '@chakra-ui/react';

type DisplayProps = {
  variant: 'display';
  size: ResponsiveValue<'lg' | 'md' | 'sm' | 'xs' | '2xs'>;
};

type HeadingProps = {
  variant: 'heading';
  size: ResponsiveValue<'lg' | 'md' | 'sm' | 'xs'>;
};

type BodyProps = {
  variant: 'body';
  size: ResponsiveValue<'lg' | 'md' | 'sm'>;
};

type LabelProps = {
  variant: 'label';
  size: ResponsiveValue<'lg' | 'md' | 'sm'>;
};

export type Props = Omit<TextProps, 'size' | 'variant'> &
  (DisplayProps | HeadingProps | BodyProps | LabelProps);

export type PartialTypographyProps = Omit<Props, 'variant' | 'size'> & {
  variant?: Props['variant'];
  size?: Props['size'];
};
