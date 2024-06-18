import { Flex } from '@node-real/uikit';

interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

export function InfoRow(props: InfoRowProps) {
  const { label, value } = props;

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex>{label}</Flex>
      <Flex>{value}</Flex>
    </Flex>
  );
}
