import { Icon, IconProps } from '@bnb-chain/space';

export function TxErrorIcon(props: IconProps) {
  return (
    <Icon width="81px" height="80px" viewBox="0 0 81 80" fill="none" {...props}>
      <rect x="0.5" width="80" height="80" rx="40" fill="#FDC4C7" />
      <rect x="13" y="12" width="56" height="56" rx="28" fill="#FF7A84" />
      <path
        d="M41.0034 41.7564L32.5482 50.2115C32.3175 50.4423 32.0274 50.5603 31.6781 50.5656C31.3287 50.571 31.0333 50.453 30.7919 50.2115C30.5504 49.97 30.4297 49.6773 30.4297 49.3333C30.4297 48.9893 30.5504 48.6966 30.7919 48.4551L39.247 40L30.7919 31.5448C30.5611 31.3141 30.4431 31.024 30.4377 30.6746C30.4324 30.3253 30.5504 30.0299 30.7919 29.7885C31.0333 29.547 31.3261 29.4263 31.6701 29.4263C32.0141 29.4263 32.3068 29.547 32.5482 29.7885L41.0034 38.2436L49.4586 29.7885C49.6893 29.5577 49.9794 29.4396 50.3287 29.4343C50.6781 29.4289 50.9735 29.547 51.2149 29.7885C51.4564 30.0299 51.5771 30.3226 51.5771 30.6666C51.5771 31.0106 51.4564 31.3034 51.2149 31.5448L42.7598 40L51.2149 48.4551C51.4457 48.6859 51.5637 48.976 51.5691 49.3253C51.5744 49.6746 51.4564 49.97 51.2149 50.2115C50.9735 50.453 50.6807 50.5737 50.3367 50.5737C49.9927 50.5737 49.7 50.453 49.4586 50.2115L41.0034 41.7564Z"
        fill="#821119"
      />
    </Icon>
  );
}