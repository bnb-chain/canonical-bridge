import { Modal, ModalOverlay, useIntl } from '@bnb-chain/space';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/core/store/hooks';
import {
  BridgeChain,
  BridgeToken,
  useSupportedFromChains,
  useSupportedTokens,
} from '@/modules/bridges/main';
import { NetworkPanel } from '@/modules/transfer/components/SelectModal/components/NetworkPanel';
import { SelectModalBody } from '@/modules/transfer/components/SelectModal/components/SelectModalBody';
import { SelectModalContent } from '@/modules/transfer/components/SelectModal/components/SelectModalContent';
import { SelectModalHeader } from '@/modules/transfer/components/SelectModal/components/SelectModalHeader';
import { NetworkSection } from '@/modules/transfer/components/SelectModal/SelectSourceModal/NetworkSection';
import { TokenSection } from '@/modules/transfer/components/SelectModal/SelectSourceModal/TokenSection';

interface SelectSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (network: BridgeChain, token?: BridgeToken) => void;
}

export function SelectSourceModal(props: SelectSourceModalProps) {
  const { isOpen, onClose, onSelect } = props;

  const { formatMessage } = useIntl();
  const toNetwork = useAppSelector((state) => state.transfer.toChain);
  const outerNetwork = useAppSelector((state) => state.transfer.fromChain);

  const [showNetworkPanel, setShowNetworkPanel] = useState(false);
  const [innerNetwork, setInnerNetwork] = useState<BridgeChain>();

  useEffect(() => {
    setInnerNetwork(outerNetwork);
  }, [outerNetwork]);

  useEffect(() => {
    if (!isOpen) {
      setShowNetworkPanel(false);
    }
  }, [isOpen]);

  const fromNetworks = useSupportedFromChains({
    toChainId: toNetwork?.id,
  });
  const tokens = useSupportedTokens({
    fromChainId: innerNetwork?.id,
    toChainId: toNetwork?.id,
  });

  const onShowNetworkPanel = () => {
    setShowNetworkPanel(true);
  };

  const onHideNetworkPanel = () => {
    setShowNetworkPanel(false);
  };

  const onSelectNetwork = (value: BridgeChain) => {
    setInnerNetwork(value);
    if (showNetworkPanel) {
      onHideNetworkPanel();
    }
  };

  const onSelectToken = (token: BridgeToken) => {
    onSelect(innerNetwork!, token);
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
          {showNetworkPanel ? 'Select Network' : 'Select Source'}
        </SelectModalHeader>

        <SelectModalBody>
          {showNetworkPanel ? (
            <NetworkPanel
              networks={fromNetworks}
              onSelect={onSelectNetwork}
              unavailableTips={formatMessage({
                id: 'select-modal.src.network.unavailable-tooltip',
              })}
            />
          ) : (
            <>
              <NetworkSection
                selectedNetwork={innerNetwork}
                networks={fromNetworks}
                onSelect={onSelectNetwork}
                onShowMore={onShowNetworkPanel}
              />
              <TokenSection
                showNetworkTips={!innerNetwork}
                selectedNetwork={innerNetwork}
                tokens={tokens}
                onSelect={onSelectToken}
              />
            </>
          )}
        </SelectModalBody>
      </SelectModalContent>
    </Modal>
  );
}
