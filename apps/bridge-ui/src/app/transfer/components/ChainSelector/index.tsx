import { Selector } from '@/components/common/Selector';
import { Circle, Image, Text } from '@node-real/uikit';

export interface ChainSelectorProps {
  title: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}

export function ChainSelector(props: ChainSelectorProps) {
  const { title, value, onChange } = props;

  const options = [
    {
      value: 'Ethereum',
      label: 'Ethereum',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
    },
    {
      value: 'Ethereum2',
      label: 'Ethereum2',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
    },
    {
      value: 'Ethereum3',
      label: 'Ethereum3',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
    },
    {
      value: 'Ethereum4',
      label: 'Ethereum4',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
    },
    {
      value: 'Ethereum4',
      label: 'Ethereum4',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
    },
    {
      value: 'Ethereum4',
      label: 'Ethereum4',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
    },
    {
      value: 'Ethereum4',
      label: 'Ethereum4',
      icon: (
        <Image
          src="https://get.celer.app/cbridge-icons/chain-icon/ETH.png"
          alt=""
        />
      ),
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
