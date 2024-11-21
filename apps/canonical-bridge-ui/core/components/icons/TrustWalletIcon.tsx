import { IconProps, Icon } from '@bnb-chain/space';

export function TrustWalletIcon(props: IconProps) {
  return (
    <Icon width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" fill="#242426" />
      <path
        d="M5.33374 6.66673L12.0003 4.5V19.5C7.23848 17.4998 5.33374 13.6665 5.33374 11.5001V6.66673Z"
        fill="#48FF91"
      />
      <path
        d="M18.6662 6.66673L12.0003 4.5V19.5C16.7622 17.4998 18.6662 13.6665 18.6662 11.5001V6.66673Z"
        fill="url(#paint0_linear_7476_132116)"
      />
      <path
        d="M18.6662 6.66673L12.0003 4.5V19.5C16.7622 17.4998 18.6662 13.6665 18.6662 11.5001V6.66673Z"
        fill="url(#paint1_linear_7476_132116)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_7476_132116"
          x1="4.77107"
          y1="21.3854"
          x2="7.65309"
          y2="0.538518"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.26" stopColor="#48FF91" />
          <stop offset="0.66" stopColor="#0094FF" />
          <stop offset="0.8" stopColor="#0038FF" />
          <stop offset="0.89" stopColor="#0500FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7476_132116"
          x1="11.7182"
          y1="21.3853"
          x2="17.1746"
          y2="1.64876"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.26" stopColor="#48FF91" />
          <stop offset="0.66" stopColor="#0094FF" />
          <stop offset="0.8" stopColor="#0038FF" />
          <stop offset="0.89" stopColor="#0500FF" />
        </linearGradient>
      </defs>
    </Icon>
  );
}
