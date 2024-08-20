import { Flex, SystemProps } from '@chakra-ui/react';

type Props = {
  size: SystemProps['flexBasis'] | 'fill';
};

export const Space = ({ size }: Props) => {
  return (
    <Flex
      {...(size === 'fill'
        ? {
            flex: '1',
          }
        : {
            flexBasis: size,
            flexShrink: 0,
          })}
    />
  );
};
