import { Icon, IconProps } from '@bnb-chain/space';

export function AvatarIcon(props: IconProps) {
  return (
    <Icon width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <g clipPath={`url(#clip0_26274_19335_)`}>
        <rect x="-5.75" y="-5.25" width="38" height="38" rx="19" fill="#B5A711" />
        <rect x="6.91406" y="7.41666" width="12.6667" height="12.6667" fill="#FFE900" />
        <rect x="19.5859" y="-5.25" width="12.6667" height="12.6667" fill="#FFE900" />
        <rect x="6.91406" y="20.0833" width="12.6667" height="12.6667" fill="#C3B524" />
        <rect x="-5.75" y="7.41666" width="12.6667" height="12.6667" fill="#DBCA13" />
        <rect x="-5.75" y="20.0833" width="12.6667" height="12.6667" fill="#FFF58B" />
        <rect x="19.5859" y="20.0833" width="12.6667" height="12.6667" fill="#FFF58B" />
        <rect x="6.91406" y="-5.25" width="12.6667" height="12.6667" fill="#FFF58B" />
      </g>
    </Icon>
  );
}
