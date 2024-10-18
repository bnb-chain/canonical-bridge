import { css, useBreakpointValue, useColorMode } from '@chakra-ui/react';
import { forwardRef, MutableRefObject, useMemo } from 'react';
import ReactSelect, {
  GroupBase,
  OptionProps,
  Props as ReactSelectProps,
  SelectInstance,
  SingleValueProps,
  StylesConfig,
} from 'react-select';

import { theme } from '../../modules/theme';
import { CLASS_NAMES } from '../constants';

import { Context } from './context';
import { SelectDropdownIndicator } from './SelectDropdownIndicator';
import { SelectLoadingIndicator } from './SelectLoadingIndicator';
import { SelectLoadingMessage } from './SelectLoadingMessage';
import { SelectOption } from './SelectOption';
import { SelectNoOptionsMessage } from './SelectNoOptionsMessage';
import { Props, Type } from './types';

export {
  SelectDropdownIndicator,
  SelectLoadingIndicator,
  SelectLoadingMessage,
  SelectOption,
  SelectNoOptionsMessage,
};
export type {
  GroupBase as SelectGroupBase,
  OptionProps as SelectOptionProps,
  SingleValueProps as SelectSingleValueProps,
};

const COMPONENT = theme.components.Input!;
const DEFAULT_PROPS = COMPONENT.defaultProps!;
const SIZES = COMPONENT.sizes!;

export const Select = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    {
      size: responsiveSize = DEFAULT_PROPS.size!,
      components: componentsProp,
      styles: stylesProp,
      ...otherProps
    }: ReactSelectProps<Option, IsMulti, Group> & Props,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    const { colorMode } = useColorMode();

    const size = useBreakpointValue(responsiveSize as any) ?? responsiveSize;
    const styles = SIZES[size as keyof typeof SIZES].field;

    const config = useMemo((): StylesConfig<Option, IsMulti, Group> => {
      return {
        control: (base, state) => {
          return {
            ...base,
            alignItems: 'start',
            minHeight: 0,
            backgroundColor: theme.colors[colorMode].input[1],
            borderColor: theme.colors[colorMode].border[4],
            color: theme.colors[colorMode].text.primary,
            ':hover, :active': {
              borderColor: theme.colors[colorMode].border[4],
            },
            ...css(styles)(theme),
            ...(state.isFocused
              ? {
                  borderColor: theme.colors[colorMode].border.brand,
                  boxShadow: `0 0 0 1px ${theme.colors[colorMode].border.brand}`,
                  ':hover, :active': {
                    borderColor: theme.colors[colorMode].border.brand,
                  },
                }
              : {}),
            [state.menuIsOpen
              ? `.${CLASS_NAMES.SELECT__DROPDOWN_ICON_UP}`
              : `.${CLASS_NAMES.SELECT__DROPDOWN_ICON_DOWN}`]: {
              display: 'block',
            },
          };
        },
        valueContainer: (base, _) => {
          return {
            ...base,
            padding: 0,
            height: '100%',
          };
        },
        indicatorsContainer: (base, _) => {
          return {
            ...base,
            fontSize: theme.sizes['6'],
            color: theme.colors[colorMode].text.secondary,
          };
        },
        indicatorSeparator: () => {
          return {
            display: 'none',
          };
        },
        dropdownIndicator: (base, _) => {
          return {
            ...base,
            margin: 0,
            padding: 0,
          };
        },
        input: (base, _) => {
          return {
            ...base,
            margin: 0,
            padding: 0,
            color: theme.colors[colorMode].text.primary,
          };
        },
        singleValue: (base, _) => {
          return {
            ...base,
            color: theme.colors[colorMode].text.primary,
          };
        },
        menu: (base, _) => {
          return {
            ...base,
            backgroundColor: theme.colors[colorMode].input[1],
            borderRadius: theme.sizes['2'],
            overflow: 'hidden',
          };
        },
        menuList: (base, _) => {
          return {
            ...base,
          };
        },
        ...stylesProp,
      };
    }, [colorMode, styles, stylesProp]);

    const components = useMemo(() => {
      return {
        DropdownIndicator: SelectDropdownIndicator,
        LoadingIndicator: SelectLoadingIndicator,
        LoadingMessage: SelectLoadingMessage,
        Option: SelectOption,
        NoOptionsMessage: SelectNoOptionsMessage,
        ...componentsProp,
      };
    }, [componentsProp]);

    return (
      <Context.Provider value={{ styles }}>
        <ReactSelect ref={ref} styles={config} components={components} {...otherProps} />
      </Context.Provider>
    );
  },
) as Type;
