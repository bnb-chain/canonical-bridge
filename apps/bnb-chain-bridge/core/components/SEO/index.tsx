import { useRouter } from 'next/router';
import { NextSeo, NextSeoProps } from 'next-seo';
import { useIntl } from '@bnb-chain/space';
import Head from 'next/head';

import { env } from '@/core/configs/env';

const faviconUrl = `${env.ASSET_PREFIX}/images/favicon.ico`;
const ogImageUrl = `${env.ASSET_PREFIX}/images/og-img.png`;

type Props = {
  title?: string;
  description?: string;
};

export const SEO = (props: Props) => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const title = props.title || formatMessage({ id: 'seo.title' });
  const description = props.description || formatMessage({ id: 'seo.description' });

  const url = `https://www.bnbchain.org${router.asPath}`;

  const seo: NextSeoProps = {
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      site_name: title,
      description,
      url,
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      // Twitter will read the og:title, og:xx etc.
      site: '@BNBChain',
      cardType: 'summary_large_image',
      handle: '@BNBChain',
    },
    additionalMetaTags: [
      {
        name: 'twitter:title',
        content: title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:url',
        content: url,
      },
      {
        name: 'twitter:image',
        content: ogImageUrl,
      },
      {
        name: 'twitter:image:src',
        content: ogImageUrl,
      },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: title,
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'x5-fullscreen',
        content: 'true',
      },
      {
        name: 'browsermode',
        content: 'application',
      },
      {
        name: 'x5-page-mode',
        content: 'app',
      },
      {
        name: 'google',
        content: 'notranslate',
      },
      {
        name: 'format-detection',
        content: 'email=no',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
    ],
    additionalLinkTags: [
      {
        rel: 'shortcut icon',
        href: faviconUrl,
        type: 'image/x-icon',
      },
      {
        rel: 'apple-touch-icon',
        href: faviconUrl,
      },
      {
        rel: 'canonical',
        href: url,
      },
    ],
  };

  return (
    <>
      <Head>
        <link
          rel="apple-touch-startup-image"
          href={faviconUrl}
          sizes="320x460"
          media="screen and (max-device-width: 320)"
        />
        <link
          rel="apple-touch-startup-image"
          href={faviconUrl}
          sizes="640x920"
          media="screen and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)"
        />
      </Head>
      <NextSeo {...seo} />
    </>
  );
};
