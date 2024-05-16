import { Selector } from '@/components/common/Selector';
import { Circle, Image, Text } from '@node-real/uikit';

export interface TokenSelectorProps {
  title: React.ReactNode;
  value: string;
  chain: string;
  onChange: (value: string) => void;
}

export function TokenSelector(props: TokenSelectorProps) {
  const { title, value, onChange } = props;

  const options = [
    {
      value: 'USDT',
      label: 'USDT',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
    {
      value: 'USDT2',
      label: 'USDT2',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
    {
      value: 'USDT3',
      label: 'USDT3',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
    {
      value: 'USDT4',
      label: 'USDT4',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
    {
      value: 'USDT4',
      label: 'USDT4',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
    {
      value: 'USDT4',
      label: 'USDT4',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
    {
      value: 'USDT4',
      label: 'USDT4',
      icon: <Image src="https://get.celer.app/cbridge-icons/USDT.png" alt="" />,
    },
  ];

  const selectedOption = options.find((item) => item.value === value);

  return (
    <Selector title={title} value={value} options={options} onChange={onChange}>
      <Circle boxSize={24} overflow="hidden">
        {selectedOption?.icon}
      </Circle>
      <Text>{selectedOption?.value}</Text>
    </Selector>
  );
}
