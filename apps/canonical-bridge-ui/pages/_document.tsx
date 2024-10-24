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
          <script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js" defer></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.onload = () => {
                new window.VConsole();
              }
            `,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              #__vconsole .vc-switch {
                bottom: 100px !important;
              }
            `,
            }}
          ></style>
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
