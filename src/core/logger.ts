import { config } from "./config"

export const loggerOptions = {
  transport: config.env !== 'production' ? {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  }: undefined,
};
