/**
 * Structured logger — only logs in __DEV__ mode.
 * Use this instead of console.log throughout the codebase.
 */
const isDev = __DEV__;

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const prefix = (level: LogLevel, tag: string): string =>
  `[Intentio/${tag}] [${level.toUpperCase()}]`;

const logger = {
  info: (tag: string, ...args: unknown[]): void => {
    if (isDev) console.log(prefix('info', tag), ...args);
  },
  warn: (tag: string, ...args: unknown[]): void => {
    if (isDev) console.warn(prefix('warn', tag), ...args);
  },
  error: (tag: string, ...args: unknown[]): void => {
    // Always log errors
    console.error(prefix('error', tag), ...args);
  },
  debug: (tag: string, ...args: unknown[]): void => {
    if (isDev) console.debug(prefix('debug', tag), ...args);
  },
};

export default logger;
