import { InfoCircleIcon } from '@bnb-chain/icons';
import { Tooltip, TooltipProps, useBreakpointValue, useDisclosure } from '@bnb-chain/space';

export const InfoTooltip = (props: Pick<TooltipProps, 'label'>) => {
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
      {...props}
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
      />
    </Tooltip>
  );
};
