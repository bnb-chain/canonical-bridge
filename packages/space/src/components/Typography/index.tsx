import { ComponentWithAs, forwardRef, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { TYPOGRAPHY_STYLES } from '../../modules/theme/internal/typography';

import { PartialTypographyProps, Props } from './types';

export type { PartialTypographyProps, Props as TypographyProps };
export { TYPOGRAPHY_STYLES };

const mapFields = (responsiveSize: Record<string, string>, styles: any, fields: string[]) => {
  const object: Record<string, Record<string, string>> = {};

  fields.forEach((field) => {
    object[field] = {};
    Object.entries(responsiveSize).forEach(([key, value]) => {
      object[field][key] = styles[value][field];
    });
  });

  return object;
};

const fields = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];

// todo: DO NOT USE BREAKPOINT HOOKS
export const Typography: ComponentWithAs<'p', Props> = forwardRef<Props, 'p'>(
  ({ variant, size: responsiveSize, ...otherProps }, ref) => {
    const responsiveStyles = TYPOGRAPHY_STYLES[variant];

    const propResponsiveStyle = useMemo(() => {
      const isStr = typeof responsiveSize === 'string';
      return mapFields(
        isStr ? { base: responsiveSize } : (responsiveSize as any),
        responsiveStyles,
        fields,
      );
    }, [responsiveSize, responsiveStyles]);

    const props = fields.reduce(
      (obj, field) => ({ ...obj, [field]: propResponsiveStyle[field] }),
      {},
    );

    const allProps = { ...props, ...otherProps };

    return <Text ref={ref} {...allProps} />;
  },
);
