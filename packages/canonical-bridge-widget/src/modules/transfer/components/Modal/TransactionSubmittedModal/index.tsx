import { Button, useIntl } from '@bnb-chain/space';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';

import { StateModal, StateModalProps } from '@/core/components/StateModal';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { EXPLORER_URL } from '@/core/constants';
import { setEstimatedAmount, setSendValue, setTransferActionInfo } from '@/modules/transfer/action';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';

export function TransactionSubmittedModal(
  props: Omit<StateModalProps, 'title'> & { hash: string; chosenBridge: string },
) {
  const { hash, chosenBridge, ...restProps } = props;
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { chain, address } = useAccount();
  const { address: tronAddress } = useTronAccount();
  const { address: solanaAddress } = useSolanaAccount();

  const useAddress = useMemo(() => {
    if (fromChain?.chainType === 'solana') {
      return solanaAddress;
    }
    if (fromChain?.chainType === 'tron') {
      return tronAddress;
    }
    return address;
  }, [address, fromChain?.chainType, solanaAddress, tronAddress]);

  return (
    <StateModal
      className="bccb-widget-transaction-submitted-modal"
      title={formatMessage({ id: 'modal.submit.title' })}
      description={formatMessage({ id: 'modal.submit.desc' })}
      onButtonClick={() => {
        dispatch(setSendValue(''));

        dispatch(setEstimatedAmount(undefined));
        dispatch(setTransferActionInfo(undefined));
      }}
      onMainButtonClick={() => {
        if (window && chosenBridge) {
          if (chosenBridge === 'cBridge' || chosenBridge === 'meson') {
            window.open(`${EXPLORER_URL[chosenBridge]}${hash}`);
          } else if (chosenBridge === 'deBridge') {
            window.open(`${EXPLORER_URL[chosenBridge]}${useAddress}`);
          } else if (chosenBridge === 'mayan') {
            window.open(`${EXPLORER_URL[chosenBridge]}/tx/${hash}`);
          } else if (chosenBridge === 'layerZero') {
            window.open(`${EXPLORER_URL[chosenBridge]}${hash}`);
          } else if (
            (chosenBridge === 'stargate' || chosenBridge === 'layerZero') &&
            chain?.blockExplorers
          ) {
            const explorerUrl = chain?.blockExplorers.default.url?.replace(/\/$/, '') ?? '';
            window.open(`${explorerUrl}/tx/${hash}`);
          }
        }
      }}
      mainButtonProps={{
        leftIcon: <ExLinkIcon w={'20px'} h={'20px'} />,
      }}
      mainButtonText={formatMessage({ id: 'modal.submit.button.view-tx' })}
      closeButton={
        <Button
          className="bccb-widget-modal-second-button"
          size="lg"
          variant={'outline'}
          w={'100%'}
          fontSize={'16px'}
          lineHeight={1.5}
          onClick={() => {
            dispatch(setSendValue(''));
            dispatch(setEstimatedAmount(undefined));
            dispatch(setTransferActionInfo(undefined));
            restProps.onClose();
          }}
        >
          {formatMessage({ id: 'modal.submit.button.close' })}
        </Button>
      }
      {...restProps}
    />
  );
}
