import { useMemo } from 'react';

export function VConsole() {
  useMemo(async () => {
    if (typeof window !== 'undefined') {
      try {
        new (await import('vconsole')).default();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Init vconsole error!`, err);
      }
    }
  }, []);
  return null;
}
