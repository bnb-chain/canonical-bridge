import { Footer as BaseFooter } from '@bnb-chain/space';
import { useRouter } from 'next/router';

import { useAppSelector } from '@/core/store/hooks';

export function Footer() {
  const router = useRouter();

  const footerMenus = useAppSelector((state) => state.common.footerMenus);
  const locale = useAppSelector((state) => state.i18n.locale);
  const messages = useAppSelector((state) => state.i18n.messages);

  return (
    <BaseFooter menus={footerMenus} locale={locale} messages={messages} pathname={router.asPath} />
  );
}
