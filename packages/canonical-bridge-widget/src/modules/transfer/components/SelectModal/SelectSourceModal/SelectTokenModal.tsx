import { Modal, ModalOverlay, useIntl } from '@bnb-chain/space';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { BridgeChain, BridgeToken, useSupportedTokens } from '@/modules/bridges';
import { SelectModalBody } from '@/modules/transfer/components/SelectModal/components/SelectModalBody';
import { SelectModalContent } from '@/modules/transfer/components/SelectModal/components/SelectModalContent';
import { SelectModalHeader } from '@/modules/transfer/components/SelectModal/components/SelectModalHeader';
import { TokenSection } from '@/modules/transfer/components/SelectModal/SelectSourceModal/TokenSection';

interface SelectTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (network: BridgeChain, token?: BridgeToken) => void;
}

export function SelectTokenModal(props: SelectTokenModalProps) {
  const { isOpen, onClose, onSelect } = props;

  const { formatMessage } = useIntl();
  const toNetwork = useAppSelector((state) => state.transfer.toChain);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const [showNetworkPanel, setShowNetworkPanel] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowNetworkPanel(false);
    }
  }, [isOpen]);

  const tokens = useSupportedTokens({
    fromChainId: fromChain?.id,
    toChainId: toNetwork?.id,
  });

  const onHideNetworkPanel = () => {
    setShowNetworkPanel(false);
  };

  const onSelectToken = (token: BridgeToken) => {
    onSelect(fromChain!, token);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false}>
      <ModalOverlay />
      <SelectModalContent>
        <SelectModalHeader
          showBack={showNetworkPanel}
          onClose={onClose}
          onBack={onHideNetworkPanel}
        >
          {formatMessage({ id: 'select-modal.select.token.title' })}
        </SelectModalHeader>

        <SelectModalBody>
          <TokenSection
            showNetworkTips={!fromChain}
            selectedNetwork={fromChain}
            tokens={tokens}
            onSelect={onSelectToken}
          />
        </SelectModalBody>
      </SelectModalContent>
    </Modal>
  );
}
