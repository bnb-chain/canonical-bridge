import { IconProps, Icon } from '@bnb-chain/space';

export function CoinbaseWalletIcon(props: IconProps) {
  return (
    <Icon width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" fill="#0051FE" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM10.2889 9.66667C9.94525 9.66667 9.66667 9.94525 9.66667 10.2889V13.7111C9.66667 14.0548 9.94525 14.3333 10.2889 14.3333H13.7111C14.0548 14.3333 14.3333 14.0548 14.3333 13.7111V10.2889C14.3333 9.94525 14.0548 9.66667 13.7111 9.66667H10.2889Z"
        fill="white"
      />
    </Icon>
  );
}
