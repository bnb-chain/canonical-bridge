import { FormattedDate } from 'react-intl';

export const formatDate = ({
  value,
}: {
  value: React.ComponentPropsWithoutRef<typeof FormattedDate>['value'];
}) => (
  <FormattedDate
    value={value}
    month="short"
    day="2-digit"
    hour12={false}
    hour="2-digit"
    minute="2-digit"
  />
);
