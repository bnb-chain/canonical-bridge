declare namespace NodeJS {
  interface ProcessEnv {
    readonly SERVER_TIMEOUT: string;
    readonly SERVER_PORT: string;
    readonly DATABASE_URL: string;
    readonly REDIS_URL: string;
  }
}
