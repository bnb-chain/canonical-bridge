import { ResponsiveValue } from '@chakra-ui/react';
import { ReactElement, RefAttributes } from 'react';
import { GroupBase, Props as ReactSelectProps, SelectInstance } from 'react-select';

import { theme } from '../../modules/theme';

const COMPONENT = theme.components.Input!;
const SIZES = COMPONENT.sizes!;

export type Props = {
  size?: ResponsiveValue<keyof typeof SIZES>;
};

export type Type = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ReactSelectProps<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>> &
    Props,
) => ReactElement;
