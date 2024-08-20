import { Modal, ModalOverlay, useIntl } from '@bnb-chain/space';

import { BridgeChain, BridgeToken, formatTokenUrl, useSupportedToChains } from '@/modules/bridges';
import { useAppSelector } from '@/core/store/hooks';
import { TokenSelectedItem } from '@/modules/transfer/components/SelectModal/SelectDestinationModal/TokenSelectedItem';
import { NetworkPanel } from '@/modules/transfer/components/SelectModal/components/NetworkPanel';
import { SelectModalBody } from '@/modules/transfer/components/SelectModal/components/SelectModalBody';
import { SelectModalContent } from '@/modules/transfer/components/SelectModal/components/SelectModalContent';
import { SelectModalHeader } from '@/modules/transfer/components/SelectModal/components/SelectModalHeader';
import { useToTokenDisplayedInfo } from '@/modules/transfer/hooks/useToTokenDisplayedInfo';

interface SelectDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (network: BridgeChain) => void;
}

export function SelectDestinationModal(props: SelectDestinationModalProps) {
  const { isOpen, onClose, onSelect } = props;

  const { formatMessage } = useIntl();
  const fromNetwork = useAppSelector((state) => state.transfer.fromChain);
  const toNetwork = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const toTokenInfo = useToTokenDisplayedInfo() as BridgeToken;

  const toNetworks = useSupportedToChains({
    fromChainId: fromNetwork?.id,
    tokenSymbol: selectedToken?.symbol,
    tokenAddress: selectedToken?.address,
  });

  const onSelectNetwork = (value: BridgeChain) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false}>
      <ModalOverlay />
      <SelectModalContent>
        <SelectModalHeader onClose={onClose}>Select Destination</SelectModalHeader>

        <SelectModalBody>
          {toTokenInfo && (
            <TokenSelectedItem
              tokenUrl={formatTokenUrl(toNetwork?.tokenUrlPattern, toTokenInfo.address)}
              data={toTokenInfo}
            />
          )}
          <NetworkPanel
            showTitle
            networks={toNetworks}
            onSelect={onSelectNetwork}
            unavailableTips={formatMessage({
              id: 'select-modal.dst.network.unavailable-tooltip',
            })}
          />
        </SelectModalBody>
      </SelectModalContent>
    </Modal>
  );
}
