import promBundle from 'express-prom-bundle';

export function metrics() {
  return promBundle({
    includeMethod: true,
    includePath: true,
    promClient: {
      collectDefaultMetrics: {
        prefix: 'multichain_bridge_ui',
      },
    },
    normalizePath: [['^/_next/.*', '/_next/#res']],
    urlValueParser: {
      extraMasks: [/^0x[a-z0-9]+$/i, /^[0-9]+$/],
    },
  });
}
