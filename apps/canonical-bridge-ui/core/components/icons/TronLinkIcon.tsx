import { IconProps, Icon } from '@bnb-chain/space';

export function TronLinkIcon(props: IconProps) {
  return (
    <Icon width="40px" height="40px" viewBox="0 0 65 65" fill="none" {...props}>
      <g clipPath="url(#clip0_18_3)">
        <path
          d="M7.30721 0C3.27132 0 0 3.59886 0 8.03839V56.9616C0 61.4011 3.27132 65 7.30721 65H57.6928C61.7283 65 65 61.4011 65 56.9616V8.03839C65 3.59886 61.7283 0 57.6928 0H7.30721Z"
          fill="url(#paint0_linear_18_3)"
        />
        <mask id="mask0_18_3" maskUnits="userSpaceOnUse" x="0" y="0" width="65" height="65">
          <path
            d="M7.30721 0C3.27132 0 0 3.59886 0 8.03839V56.9616C0 61.4011 3.27132 65 7.30721 65H57.6928C61.7283 65 65 61.4011 65 56.9616V8.03839C65 3.59886 61.7283 0 57.6928 0H7.30721Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_18_3)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M55.146 50.8465L85.3058 45.3974L50.7112 87.4441L55.146 50.8465ZM50.8147 48.7967L46.1368 87.4028L20.893 24.0406L50.8147 48.7967ZM52.8592 44.5958L24.1489 20.8417L71.0713 29.4557L52.8592 44.5958ZM76.0546 31.217L86.012 40.661L58.775 45.5816L76.0546 31.217ZM77.101 25.9507L12 14L46.263 100L94 41.9787L77.101 25.9507Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_18_3"
          x1="537.383"
          y1="266.088"
          x2="6244.77"
          y2="6544.28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#145ECC" />
          <stop offset="1" stopColor="#1260CC" />
        </linearGradient>
        <clipPath id="clip0_18_3">
          <rect width="65" height="65" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  );
}
