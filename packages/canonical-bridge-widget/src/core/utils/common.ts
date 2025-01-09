export function openLink(url = '') {
  if (!url) return;
  window.open(url, '_blank', 'noopener noreferrer');
}

export async function sleep(duration = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, duration);
  });
}
