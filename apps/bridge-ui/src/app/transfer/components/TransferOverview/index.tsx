import { Flex } from '@node-real/uikit';

export function TransferOverview() {
  return (
    <Flex
      flexDir="column"
      borderBottomRadius={16}
      p={24}
      position="absolute"
      bottom={0}
      left={24}
      transform="translateY(100%)"
      border="1px solid readable.border"
      bg="bg.top.normal"
      w="calc(100% - 48px)"
      gap={8}
    >
      <InfoRow label="Bridge Rate" value={'-'} />
      <InfoRow label="Fee" value={'-'} />
      <InfoRow label="Minimum Received" value={'-'} />
      <InfoRow label="Estimated Time of Arrival" value={'-'} />
      <InfoRow label="Received Gas Tokens On Arrival" value={'-'} />
    </Flex>
  );
}

interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

function InfoRow(props: InfoRowProps) {
  const { label, value } = props;

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex>{label}</Flex>
      <Flex>{value}</Flex>
    </Flex>
  );
}
