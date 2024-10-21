import { Checkbox, CheckboxProps, theme, useColorMode } from '@bnb-chain/space';

export const ConfirmCheckbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const { colorMode } = useColorMode();

  const { isChecked } = props;

  return (
    <Checkbox
      _checked={{
        '& .chakra-checkbox__control': {
          border: `1px solid ${theme.colors[colorMode].text.brand}`,
          color: theme.colors[colorMode].text.brand,
        },
        '& .chakra-text': {
          color: theme.colors[colorMode].text.tertiary,
        },
      }}
      // _hover={{
      //   '& .chakra-text': {
      //     color: theme.colors[colorMode].text.primary,
      //   },
      // }}
      sx={{
        alignItems: 'flex-start',
        '&: hover': {
          '.chakra-checkbox__control': {
            border: isChecked
              ? `1px solid ${theme.colors[colorMode].text.brand}`
              : `1px solid ${theme.colors[colorMode].text.tertiary}`,
          },
        },

        '.chakra-checkbox__control': {
          border: `1px solid ${theme.colors[colorMode].text.tertiary}`,
          borderRadius: '3px',
          w: theme.sizes['4'],
          h: theme.sizes['4'],
          visibility: 'visible',
          pos: 'relative',

          _hover: {
            bg: isChecked ? 'transpartent' : theme.colors[colorMode].layer['3'].hover,

            '::before': {
              content: '""',
              w: theme.sizes['6'],
              h: theme.sizes['6'],
              pos: 'absolute',
              bg: theme.colors[colorMode].layer[3].hover,
              borderRadius: theme.sizes['2'],
              zIndex: '-1',
            },
          },

          _active: {
            color: theme.colors[colorMode].text.primary,
            bg: theme.colors[colorMode].layer['3'].active,
          },

          svg: {
            w: '80%',
          },
        },
      }}
      {...props}
    />
  );
};
