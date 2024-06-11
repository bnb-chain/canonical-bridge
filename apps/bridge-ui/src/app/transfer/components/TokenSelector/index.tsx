import { Selector, SelectorProps } from '@/components/common/Selector';
import { Circle, Flex, Image, Text } from '@node-real/uikit';

export interface TokenSelectorProps extends SelectorProps {
  options: Array<{
    icon: string;
    value: any;
    label: React.ReactNode;
    symbol: string;
    method?: string;
    decimal: number;
    bridgeAddress: string;
  }>;
}

export function TokenSelector(props: TokenSelectorProps) {
  const { title, value, options, onChange, ...restProps } = props;

  const finalOptions = options.map((item) => {
    return {
      value: {
        tokenAddress: item.value,
        tokenSymbol: item.symbol,
        tokenMethod: item?.method,
        tokenDecimal: item.decimal,
        bridgeAddress: item?.bridgeAddress,
      },
      label: (
        <Flex alignItems="center" gap={16}>
          <Circle boxSize={24} overflow="hidden">
            <Image src={item.icon} alt={item.value} />
          </Circle>
          {item.label}
        </Flex>
      ),
    };
  });
  const selectedOption = options.find((item) => {
    return item.value === value.tokenAddress;
  });

  return (
    <Selector
      title={title}
      value={value}
      options={finalOptions}
      onChange={onChange}
      {...restProps}
    >
      <Circle boxSize={24} overflow="hidden">
        <Image src={selectedOption?.icon} alt={selectedOption?.value} />
      </Circle>
      <Text>{selectedOption?.symbol}</Text>
    </Selector>
  );
}
