import { LoadingSvg } from '@/app/transfer/components/LoadingImg';
import { Flex } from '@node-real/uikit';

interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  isLoading?: boolean;
}

export function InfoRow(props: InfoRowProps) {
  const { label, value, isLoading } = props;

  return (
    <Flex alignItems="center" justifyContent="space-between" h={24}>
      <Flex>{label}</Flex>
      {isLoading ? <LoadingSvg /> : <Flex>{value}</Flex>}
    </Flex>
  );
}
