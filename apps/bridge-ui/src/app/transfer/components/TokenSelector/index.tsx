import { Selector, SelectorProps } from '@/components/common/Selector';
import { Circle, Flex, Image, Text } from '@node-real/uikit';

export interface TokenSelectorProps extends SelectorProps {
  options: Array<{
    icon: string;
    value: any;
    label: React.ReactNode;
    symbol: React.ReactNode;
  }>;
}

export function TokenSelector(props: TokenSelectorProps) {
  const { title, value, options, onChange, ...restProps } = props;

  const finalOptions = options.map((item) => ({
    value: item.value,
    label: (
      <Flex alignItems="center" gap={16}>
        <Circle boxSize={24} overflow="hidden">
          <Image src={item.icon} alt={item.value} />
        </Circle>
        {item.label}
      </Flex>
    ),
  }));
  const selectedOption = options.find((item) => item.value === value);

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
