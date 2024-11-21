import { IconProps, Icon } from '@bnb-chain/space';

export function OkxWalletIcon(props: IconProps) {
  return (
    <Icon width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 6H10V10L14 10V14H9.99997V10L6 10V6ZM18 6H14V10H18V6ZM6 14H10V18H6V14ZM18 14H14V18H18V14Z"
        fill="white"
      />
    </Icon>
  );
}
