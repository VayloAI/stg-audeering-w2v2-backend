declare module "bun" {
  interface Env {
    SERVICE_HOST: string;
    SERVICE_PORT: number;
    LOG_TO_FILE: string;
    LOKI_HOST: string;
    LOKI_USER: string;
    LOKI_PASSWORD: string;
    LOKI_LABEL: string;
    POSTGRES_NAME: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_USER: string;
    REDIS_PASSWORD: string;
    NODE_ENV: string;
  }
}
