export const toLocalePathname = (pathname: string, locale: string) => {
  if (!pathname || pathname === '/') {
    return `/${locale}`;
  }

  return pathname?.replace(/\/[a-z]{2}(-[A-Z]{2})?/, `/${locale}`);
};
