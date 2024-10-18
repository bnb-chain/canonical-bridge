import { Menu, MenuProps } from '@bnb-chain/space';

export interface DropdownProps extends MenuProps {}

export function Dropdown(props: DropdownProps) {
  const { ...restProps } = props;
  return <Menu placement="bottom-end" {...restProps} />;
}
