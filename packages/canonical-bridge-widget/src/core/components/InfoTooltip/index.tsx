import { InfoCircleIcon } from '@bnb-chain/icons';
import {
  IconProps,
  Tooltip,
  TooltipProps,
  useBreakpointValue,
  useDisclosure,
} from '@bnb-chain/space';
import React from 'react';
import { useMemo } from 'react';

interface InfoTooltipProps extends Omit<TooltipProps, 'children'> {
  iconProps?: IconProps;
  children?: React.ReactElement;
}

export const InfoTooltip = (props: InfoTooltipProps) => {
  const { iconProps, children, ...restProps } = props;
  // Make tooltip controlled on mobile devices, default tooltip doesn't work.
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

  const clone = useMemo(() => {
    const element = children || <InfoCircleIcon display={'inline'} w={'16px'} h={'16px'} />;
    return React.cloneElement(element, {
      ...iconProps,
      ...(isBase && {
        onMouseEnter: onOpen,
        onMouseLeave: onClose,
        onClick: onToggle,
      }),
    });
  }, [children, iconProps, isBase, onClose, onOpen, onToggle]);

  if (!restProps.label) return null;
  return (
    <Tooltip
      hasArrow
      className="bccb-widget-info-tooltip"
      placement="top"
      {...(isBase && {
        isOpen,
      })}
      {...restProps}
    >
      {clone}
    </Tooltip>
  );
};
