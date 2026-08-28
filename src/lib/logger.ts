type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(
  level: LogLevel,
  message: string,
  context?: LogContext,
): string {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatMessage("debug", message, context));
    }
  },

  info(message: string, context?: LogContext) {
    console.info(formatMessage("info", message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage("warn", message, context));
  },

  error(message: string, context?: LogContext) {
    console.error(formatMessage("error", message, context));
  },
};
