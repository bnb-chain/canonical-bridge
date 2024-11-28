export function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
}

export function isSmallIOS(): boolean {
  return typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent);
}

export function isLargeIOS(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    (/iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  );
}

export function isIOS(): boolean {
  return isSmallIOS() || isLargeIOS();
}

export function isMobile(): boolean {
  return isAndroid() || isIOS();
}

// telegram mini app
export function isTMA(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const check = (host: any) => {
    return (
      typeof host !== 'undefined' &&
      'TelegramWebviewProxy' in host &&
      'postEvent' in host.TelegramWebviewProxy &&
      typeof host.TelegramWebviewProxy.postEvent === 'function'
    );
  };

  return check(window);
}
