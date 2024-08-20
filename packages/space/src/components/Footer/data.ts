import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ANALYTICS_IDS } from './analytics';

export const useData = (): {
  [key: string]: {
    title: string;
    href: string;
    target?: React.HTMLAttributeAnchorTarget;
    'data-analytics-id': string;
  }[];
} => {
  const { formatMessage, locale } = useIntl();

  return useMemo(() => {
    return {
      explore: [
        {
          title: formatMessage({ id: 'footer.link.trust-wallet' }),
          href: 'https://trustwallet.com/',
          target: '_blank',
          'data-analytics-id': ANALYTICS_IDS['footer']['explore'].click_footer_TrustWallet,
        },
        {
          title: formatMessage({ id: 'footer.link.binance-wallet' }),
          href: 'https://www.bnbchain.org/en/binance-wallet',
          'data-analytics-id': ANALYTICS_IDS['footer']['explore'].click_footer_BinanceWallet,
        },
        {
          title: formatMessage({ id: 'footer.link.dapp-bay' }),
          href: 'https://dappbay.bnbchain.org?utm_source=Org&utm_medium=Channel&utm_campaign=homepage_240124&utm_content=homepage',
          target: '_blank',
          'data-analytics-id': ANALYTICS_IDS['footer']['explore'].click_footer_DappBay,
        },
      ],
      build: [
        {
          title: formatMessage({ id: 'footer.link.developers' }),
          href: `https://developer.bnbchain.org/`,
          'data-analytics-id': ANALYTICS_IDS['footer']['build'].click_footer_developers,
        },
        {
          title: formatMessage({ id: 'footer.link.whitepaper' }),
          href: 'https://github.com/bnb-chain/whitepaper',
          target: '_blank',
          'data-analytics-id': ANALYTICS_IDS['footer']['build'].click_footer_whitepaper,
        },
        {
          title: formatMessage({ id: 'footer.link.forum' }),
          href: 'http://forum.bnbchain.org/',
          target: '_blank',
          'data-analytics-id': ANALYTICS_IDS['footer']['build'].click_footer_forum,
        },
        {
          title: formatMessage({ id: 'footer.link.bridge' }),
          href: `https://www.bnbchain.org/${locale}/bnb-chain-bridges`,
          target: '_self',
          'data-analytics-id': ANALYTICS_IDS['footer']['build'].click_footer_bridge,
        },
      ],
      participate: [
        {
          title: formatMessage({ id: 'footer.link.events' }),
          href: `https://www.bnbchain.org/${locale}/events`,
          'data-analytics-id': ANALYTICS_IDS['footer']['participate'].click_footer_events,
        },
        {
          title: formatMessage({ id: 'footer.link.mvb' }),
          href: `https://www.bnbchain.org/en/bsc-mvb-program`,
          'data-analytics-id': ANALYTICS_IDS['footer']['participate'].click_footer_MVB,
        },
        {
          title: formatMessage({ id: 'footer.link.hackathon' }),
          href: `https://www.bnbchain.org/${locale}/hackathon`,
          'data-analytics-id': ANALYTICS_IDS['footer']['participate'].click_footer_hackathon,
        },
        {
          title: formatMessage({ id: 'footer.link.developer-programs' }),
          href: `https://www.bnbchain.org/${locale}/developers/developer-programs`,
          'data-analytics-id':
            ANALYTICS_IDS['footer']['participate'].click_footer_developerPrograms,
        },
        {
          title: formatMessage({ id: 'footer.link.martians-program' }),
          href: `https://www.bnbchain.org/${locale}/martians-program`,
          'data-analytics-id': ANALYTICS_IDS['footer']['participate'].click_footer_MartiansProgram,
        },
        {
          title: formatMessage({ id: 'footer.link.bug-bounty' }),
          href: 'https://bugbounty.bnbchain.org',
          target: '_blank',
          'data-analytics-id': ANALYTICS_IDS['footer']['participate'].click_footer_bugBountry,
        },
      ],
      about: [
        {
          title: formatMessage({ id: 'footer.link.privacy-policy' }),
          href: `https://www.bnbchain.org/${locale}/privacy-policy`,
          'data-analytics-id': ANALYTICS_IDS['footer']['about'].click_footer_privacyPolicy,
        },
        {
          title: formatMessage({ id: 'footer.link.terms-of-use' }),
          href: `https://www.bnbchain.org/${locale}/terms`,
          'data-analytics-id': ANALYTICS_IDS['footer']['about'].click_footer_termsOfUse,
        },
        {
          title: formatMessage({ id: 'footer.link.careers' }),
          href: `https://jobs.bnbchain.org/companies/bnb-chain#content`,
          target: '_blank',
          'data-analytics-id': ANALYTICS_IDS['footer']['about'].click_footer_careers,
        },
        {
          title: formatMessage({ id: 'footer.link.verification' }),
          href: `https://www.bnbchain.org/${locale}/official-verification`,
          'data-analytics-id': ANALYTICS_IDS['footer']['about'].click_footer_verification,
        },
        {
          title: formatMessage({ id: 'footer.link.contact-us' }),
          href: `https://www.bnbchain.org/${locale}/contact`,
          'data-analytics-id': ANALYTICS_IDS['footer']['about'].click_footer_contactUs,
        },
      ],
    };
  }, [formatMessage, locale]);
};
