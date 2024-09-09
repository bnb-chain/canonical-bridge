import { parseUnits } from 'viem';
import { Button, theme, Typography, useColorMode, useIntl } from '@bnb-chain/space';
import { useEffect } from 'react';

import { useApprove } from '@/core/contract/hooks';
import { useAppSelector } from '@/core/store/hooks';
import { StateModal, StateModalProps } from '@/core/components/StateModal';

export function TransactionApproveModal(
  props: Omit<StateModalProps, 'title'> & {
    onOpenConfirmingModal: () => void;
    onCloseConfirmingModal: () => void;
  },
) {
  const { onOpenConfirmingModal, onCloseConfirmingModal, ...restProps } = props;

  const { approveErc20Token, isLoadingApprove } = useApprove();
  const { formatMessage } = useIntl();

  const { colorMode } = useColorMode();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  useEffect(() => {
    if (isLoadingApprove) {
      onOpenConfirmingModal();
    } else {
      onCloseConfirmingModal();
    }
  }, [isLoadingApprove, onOpenConfirmingModal, onCloseConfirmingModal]);
  return (
    <StateModal
      type="approve"
      title={formatMessage({ id: 'modal.approve.title' })}
      description={
        <>
          {formatMessage({ id: 'modal.approve.desc.1' })}{' '}
          {
            <Typography
              display={'inline-block'}
              size={'md'}
              variant="body"
              color={theme.colors[colorMode].text.inverse}
              fontWeight={500}
            >
              {sendValue} {selectedToken?.symbol}
            </Typography>
          }{' '}
          {formatMessage({ id: 'modal.approve.desc.2' })}
        </>
      }
      mainButtonText={formatMessage({ id: 'modal.approve.button.confirm' })}
      onMainButtonClick={async () => {
        if (selectedToken && transferActionInfo?.bridgeAddress) {
          try {
            const hash = await approveErc20Token(
              selectedToken.address as `0x${string}`,
              transferActionInfo?.bridgeAddress as `0x${string}`,
              parseUnits(sendValue, selectedToken.decimal),
            );
            if (hash) {
              restProps.onClose();
            }
          } catch (e: any) {
            //eslint-disable-next-line no-console
            console.log(e);
            restProps.onClose();
          }
        }
      }}
      closeButton={
        <Button
          size="lg"
          variant={'outline'}
          w={'100%'}
          fontSize={'16px'}
          lineHeight={1.5}
          onClick={restProps.onClose}
        >
          {formatMessage({ id: 'modal.approve.button.close' })}
        </Button>
      }
      {...restProps}
    />
  );
}
