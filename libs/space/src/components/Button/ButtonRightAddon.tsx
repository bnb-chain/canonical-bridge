import {
  ButtonProps,
  Center,
  SystemStyleObject,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';
import { rgba } from 'polished';
import { useMemo } from 'react';

import { theme } from '../../modules/theme';
import { CLASS_NAMES } from '../constants';

const COMPONENT = theme.components.Button!;
const DEFAULT_PROPS = COMPONENT.defaultProps!;
const SIZES = COMPONENT.sizes!;

type Props = Pick<ButtonProps, 'children' | 'colorScheme' | 'size' | 'variant'>;

export const ButtonRightAddon = ({
  children,
  size: responsiveSize = DEFAULT_PROPS.size!,
  variant = DEFAULT_PROPS.variant!,
}: Props) => {
  const { colorMode } = useColorMode();

  const borderColor: SystemStyleObject['borderColor'] = useMemo(() => {
    if (variant === 'solid') {
      return rgba(theme.colors[colorMode].border[1], 0.15);
    }
    if (variant === 'outline') {
      return 'inherit';
    }
    return 'transparent';
  }, [colorMode, variant]);

  const size = useBreakpointValue(responsiveSize as any) ?? responsiveSize;
  const styles = SIZES[size as keyof typeof SIZES];

  return (
    <Center
      className={CLASS_NAMES.BUTTON__RIGHT_ADDON}
      h="100%"
      w={styles.h}
      ml={styles.px}
      mr={`-${styles.px}`}
      {...(borderColor !== 'transparent' && {
        borderLeft: '1px solid',
      })}
      borderColor={borderColor}
    >
      {children}
    </Center>
  );
};
