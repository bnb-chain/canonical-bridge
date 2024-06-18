import { CBridgeOption } from '@/app/transfer/components/TransferOverview/CBridgeOption';
import { DeBridgeOption } from '@/app/transfer/components/TransferOverview/DeBridgeOption';

import { useAppSelector } from '@/store/hooks';
import { Flex } from '@node-real/uikit';

export function TransferOverview() {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  return (
    <Flex flexDir={'column'} gap={'8px'}>
      Fee Overview: Please choose the below routes to make a transfer
      {selectedToken?.tags.includes('cbridge') && <CBridgeOption />}
      {selectedToken?.tags.includes('debridge') && <DeBridgeOption />}
    </Flex>
  );
}
