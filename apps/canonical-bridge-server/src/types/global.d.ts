declare namespace NodeJS {
  interface ProcessEnv {
    readonly SERVER_TIMEOUT: string;
    readonly SERVER_PORT: string;
    readonly DATABASE_URL: string;
    readonly REDIS_URL: string;
    readonly CMC_API_KEY: string;
    readonly CMC_API_ENDPOINT: string;
    readonly CBRIDGE_ENDPOINT: string;
    readonly DEBRIDGE_ENDPOINT: string;
  }
}
