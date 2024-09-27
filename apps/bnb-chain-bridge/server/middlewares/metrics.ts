import promBundle from 'express-prom-bundle';

export function metrics() {
  return promBundle({
    includeMethod: true,
    includePath: true,
    promClient: {
      collectDefaultMetrics: {
        prefix: 'bnb_chain_bridge_',
      },
    },
    normalizePath: [['^/_next/.*', '/_next/#res']],
    urlValueParser: {
      extraMasks: [/^0x[a-z0-9]+$/i, /^[0-9]+$/],
    },
  });
}
