/* eslint-disable @next/next/next-script-for-ga */
import { ColorModeScript, theme } from '@bnb-chain/space';
import NextDocument, { Head, Html, Main, NextScript as NextDocumentScript } from 'next/document';

import { env } from '@/core/env';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href={`${env.ASSET_PREFIX}/fonts/index.css`} />
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
