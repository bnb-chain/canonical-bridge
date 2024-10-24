import { Icon, IconProps } from '@bnb-chain/space';

export function CBridgeIcon(props: IconProps) {
  return (
    <Icon
      width="440"
      height="280"
      viewBox="0 0 440 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="89.8975" cy="187.751" r="70.8975" fill="#444444" />
      <circle cx="349.536" cy="187.751" r="70.8975" fill="#DDDDDD" />
      <mask
        id="mask0_1455_365"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="44"
        y="22"
        width="350"
        height="174"
      >
        <rect x="44.8662" y="22" width="348.739" height="173.412" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1455_365)">
        <mask
          id="mask1_1455_365"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="46"
          y="24"
          width="347"
          height="481"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M219.297 24.6375C123.596 24.6375 46.0146 99.938 46.0146 192.826V504.033H132.91V200.862C132.91 154.555 171.586 117.016 219.295 117.016C267.005 117.016 305.681 154.555 305.681 200.862V504.033H392.579V192.826C392.579 99.9379 314.998 24.6375 219.297 24.6375Z"
            fill="#E9BCFF"
          />
        </mask>
        <g mask="url(#mask1_1455_365)">
          <path
            d="M46.0176 197.92C46.0176 102.219 123.599 24.6375 219.3 24.6375C315.001 24.6375 392.582 102.219 392.582 197.92V504.033H46.0176V197.92Z"
            fill="#E9BCFF"
          />
          <path
            d="M65.6729 200.579C65.6729 115.606 134.557 46.7213 219.531 46.7213C304.505 46.7213 373.389 115.606 373.389 200.579V534.718H65.6729V200.579Z"
            fill="#2C98F3"
          />
          <path
            d="M85.8828 200.181C85.8828 127.629 144.698 68.8138 217.25 68.8138C289.802 68.8138 348.617 127.629 348.617 200.181V583.922H85.8828V200.181Z"
            fill="#58C971"
          />
          <path
            d="M110.421 202.796C110.421 142.665 159.166 93.9194 219.297 93.9194C279.428 93.9194 328.174 142.665 328.174 202.796V645.175H110.421V202.796Z"
            fill="#FFCA42"
          />
        </g>
      </g>
    </Icon>
  );
}
