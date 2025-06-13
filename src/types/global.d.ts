declare module "bun" {
  interface Env {
    SERVICE_HOST: string;
    SERVICE_PORT: number;
    SERVICE_SECRET: string;
    SERVICE_SECRET_HEADER: string;
    LOG_TO_FILE: string;
    LOKI_HOST: string;
    LOKI_USER: string;
    LOKI_PASSWORD: string;
    LOKI_LABEL: string;
    NATS_SERVERS: string;
    POSTGRES_NAME: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_USER: string;
    REDIS_PASSWORD: string;
    REDIS_TTL: number;
    NODE_ENV: string;
  }
}
