type LogLevel = 'info' | 'warn' | 'error';

const isDev = process.env.NODE_ENV === 'development';

function log(level: LogLevel, message: string, data?: unknown) {
  if (isDev) {
    const prefix = `[VERA ${level.toUpperCase()}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, data ?? '');
        break;
      case 'warn':
        console.warn(prefix, message, data ?? '');
        break;
      default:
        console.log(prefix, message, data ?? '');
    }
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};