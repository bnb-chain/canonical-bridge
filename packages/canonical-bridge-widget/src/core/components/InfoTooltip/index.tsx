import { InfoCircleIcon } from '@bnb-chain/icons';
import {
  IconProps,
  Tooltip,
  TooltipProps,
  useBreakpointValue,
  useDisclosure,
} from '@bnb-chain/space';

interface InfoTooltipProps extends Omit<TooltipProps, 'children'> {
  iconProps?: IconProps;
}

export const InfoTooltip = (props: InfoTooltipProps) => {
  const { iconProps, ...restProps } = props;

  // Make tooltip controlled on mobile devices, default tooltip doesn't work.
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

  return (
    <Tooltip
      hasArrow
      placement="top"
      maxW={'265px'}
      {...(isBase && {
        isOpen,
      })}
      {...restProps}
    >
      <InfoCircleIcon
        display={'inline'}
        w={'16px'}
        h={'16px'}
        {...(isBase && {
          onMouseEnter: onOpen,
          onMouseLeave: onClose,
          onClick: onToggle,
        })}
        {...iconProps}
      />
    </Tooltip>
  );
};
