/* eslint-disable @next/next/next-script-for-ga */
import { ColorModeScript, theme } from '@bnb-chain/space';
import NextDocument, { Head, Html, Main, NextScript as NextDocumentScript } from 'next/document';

import { env } from '@/core/configs/env';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href={`${env.ASSET_PREFIX}/fonts/index.css`} />
          {/* eslint-disable-next-line @next/next/next-script-for-ga */}
          {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-T2114CV11Z"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-T2114CV11Z');
              `,
            }}
          ></script> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function (w, d, s, l, i) {
                  w[l] = w[l] || [];
                  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                  var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                  j.async = true;
                  j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' +
                    i +
                    dl +
                    (window.location.hostname === 'www.bnbchain.org'
                      ? '&gtm_auth=yNIE-L06jPH-rS5Wug7Dxg&gtm_preview=env-1&gtm_cookies_win=x'
                      : '&gtm_auth=nbvRy1iQiFBIlgDWE8wJUA&gtm_preview=env-4&gtm_cookies_win=x');
                  f.parentNode.insertBefore(j, f);
                })(window, document, 'script', 'dataLayer', 'GTM-W9BVQXM');
              `,
            }}
          ></script>
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextDocumentScript />
        </body>
      </Html>
    );
  }
}
