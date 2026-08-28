import { env } from "./env";

export const databaseConfig = {
  url: env.DATABASE_URL,
  // Query logging slows every DB call in the terminal — keep off unless debugging.
  logQueries: false,
} as const;
