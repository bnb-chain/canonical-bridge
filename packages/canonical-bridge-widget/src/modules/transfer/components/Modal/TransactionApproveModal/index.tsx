import { parseUnits } from 'viem';
import { Button, theme, Typography, useColorMode, useIntl } from '@bnb-chain/space';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useApprove } from '@/core/contract/hooks';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { StateModal, StateModalProps } from '@/core/components/StateModal';
import { reportEvent } from '@/core/utils/gtm';
import { useTrc20 } from '@/modules/aggregator/adapters/meson/hooks/useTrc20';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

export function TransactionApproveModal(
  props: Omit<StateModalProps, 'title'> & {
    onOpenConfirmingModal: () => void;
    onCloseConfirmingModal: () => void;
  },
) {
  const { onOpenConfirmingModal, onCloseConfirmingModal, ...restProps } = props;

  const [mainButtonIsDisabled, setMainButtonIsDisabled] = useState(false);
  const { approveErc20Token, isLoadingApprove } = useApprove();
  const { formatMessage } = useIntl();

  const { isConnected: isEvmConnected } = useAccount();
  const { isConnected: isTronConnected } = useTronAccount();

  const { approveTrc20 } = useTrc20();

  const { colorMode } = useColorMode();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  useEffect(() => {
    if (isLoadingApprove) {
      onOpenConfirmingModal();
    } else {
      onCloseConfirmingModal();
    }
  }, [isLoadingApprove, onOpenConfirmingModal, onCloseConfirmingModal]);

  const reportApproval = (variant: 'Approve' | 'Deny') => {
    reportEvent({
      id: 'click_bridge_approvalModal',
      params: {
        item_category: fromChain?.name,
        item_category2: toChain?.name,
        token: selectedToken!.displaySymbol,
        value: sendValue,
        item_variant: variant,
      },
    });
  };

  return (
    <StateModal
      className="bccb-widget-transaction-approve-modal"
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
      mainButtonIsDisabled={mainButtonIsDisabled}
      onMainButtonClick={async () => {
        if (selectedToken && transferActionInfo?.bridgeAddress) {
          try {
            reportApproval('Approve');
            setMainButtonIsDisabled(true);
            if (isEvmConnected && fromChain?.chainType !== 'tron') {
              const hash = await approveErc20Token(
                selectedToken.address as `0x${string}`,
                transferActionInfo?.bridgeAddress as `0x${string}`,
                parseUnits(sendValue, selectedToken.decimals),
              );
              if (hash) {
                restProps.onClose();
              }
            } else if (isTronConnected && fromChain?.chainType === 'tron') {
              const approveReceipt = await approveTrc20({
                tronBridgeAddress: transferActionInfo.bridgeAddress,
                trc20Address: selectedToken.address,
                amount: sendValue,
              });
              if (approveReceipt) {
                restProps.onClose();
              }
            }
          } catch (e: any) {
            //eslint-disable-next-line no-console
            console.log(e);
            restProps.onClose();
          } finally {
            setMainButtonIsDisabled(false);
          }
        }
      }}
      closeButton={
        <Button
          className="bccb-widget-modal-second-button"
          size="lg"
          variant={'outline'}
          w={'100%'}
          fontSize={'16px'}
          lineHeight={1.5}
          onClick={() => {
            reportApproval('Deny');
            restProps.onClose();
          }}
        >
          {formatMessage({ id: 'modal.approve.button.close' })}
        </Button>
      }
      {...restProps}
    />
  );
}
