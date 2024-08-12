import { useAccount } from 'wagmi';
import { Button, theme, useIntl } from '@bnb-chain/space';

import { StateModal, StateModalProps } from '@/core/components/StateModal';
import { useAppDispatch } from '@/core/store/hooks';
import { EXPLORER_URL } from '@/core/constants';
import {
  setEstimatedAmount,
  setReceiveValue,
  setSendValue,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';

export function TransactionSubmittedModal(
  props: Omit<StateModalProps, 'title'> & { hash: string; chosenBridge: string },
) {
  const { hash, chosenBridge, ...restProps } = props;
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const { address } = useAccount();
  return (
    <StateModal
      title={formatMessage({ id: 'modal.submit.title' })}
      description={formatMessage({ id: 'modal.submit.desc' })}
      onButtonClick={() => {
        dispatch(setSendValue(''));
        dispatch(setReceiveValue(undefined));
        dispatch(setEstimatedAmount(undefined));
        dispatch(setTransferActionInfo(undefined));
      }}
      onMainButtonClick={() => {
        if (window && chosenBridge) {
          if (chosenBridge === 'cBridge') {
            window.open(`${EXPLORER_URL[chosenBridge]}${hash}`);
          } else if (chosenBridge === 'deBridge') {
            window.open(`${EXPLORER_URL[chosenBridge]}${address}`);
          }
        }
      }}
      mainButtonProps={{
        leftIcon: <ExLinkIcon w={theme.sizes['5']} h={theme.sizes['5']} />,
      }}
      mainButtonText={formatMessage({ id: 'modal.submit.button.view-tx' })}
      closeButton={
        <Button
          size="lg"
          variant={'outline'}
          w={'100%'}
          fontSize={theme.sizes['4']}
          lineHeight={1.5}
          onClick={() => {
            dispatch(setSendValue(''));
            dispatch(setReceiveValue(undefined));
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
