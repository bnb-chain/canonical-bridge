import { BoxProps, ComponentWithAs, IconProps } from '@chakra-ui/react';

import { AddNetworkProps } from '../Menu/types';

export interface IHeader extends BoxProps {
  locale?: string;
  messages?: Record<string, string>;
  logo?: React.ReactNode;
  isTransparent?: boolean;
  isNotification?: boolean;
  menus?: Level1Props[];
}

export type HeaderContainerProps = BoxProps & Pick<IHeader, 'isTransparent' | 'logo'>;

export interface ThumbnailProps {
  title?: string;
  subtitle?: string;
  selfLink?: string;
  thumbnailLink?: {
    href: string;
    name: string;
  };
  thumbnailImage?: {
    src: string;
    alt: string;
  };
  thumbnailAnalyticsId?: string;
}

export interface Level1Props extends ThumbnailProps {
  key?: string;
  id: string;
  name: string;
  desc: string;
  image: string;
  analyticsId: string;
  children: Array<Level2Props>;
  button?: ButtonItemProp;
}

export interface Level2Props extends ThumbnailProps {
  name: string;
  desc?: string;
  tag?: {
    name: string;
    variant: 'solid' | 'outline' | 'warning';
    link?: string;
    target?: string;
  };
  children?: Array<Level3Props>;
  target?: string;
  icon?: ComponentWithAs<'svg', IconProps> | any;
  analyticsId?: string;
  link?: string;
  subLink?: string;
  wallet?: AddNetworkProps;
  buttonBottom?: boolean;
  selfLink?: string;
  selfAnalyticsId?: string;
}

export interface Level3Props {
  icon?: ComponentWithAs<'svg', IconProps> | any;
  name: string;
  desc: string;
  target: string;
  link: string;
  analyticsId: string;
  tag?: {
    name: string;
    variant: 'solid' | 'outline' | 'warning';
    link?: string;
    target?: string;
  };
}
export type DataProps = Array<Level1Props>;

export type ButtonListProps = Array<ButtonItemProp>;

interface ButtonItemProp {
  name: string;
  variant?: string;
  href: string;
  analyticsId?: string;
  target?: string;
}
