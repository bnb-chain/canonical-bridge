export const env = {
  NETWORK: process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet',
  CBRIDGE_ENDPOINT: process.env.NEXT_PUBLIC_CBRIDGE_ENDPOINT ?? '',
  DEBRIDGE_ENDPOINT: process.env.NEXT_PUBLIC_DEBRIDGE_ENDPOINT ?? '',
  DEBRIDGE_STATS_ENDPOINT:
    process.env.NEXT_PUBLIC_DEBRIDGE_STATS_ENDPOINT ?? '',
};