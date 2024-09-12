export function formatEstimatedTime(value?: string | number) {
  if (!value) {
    return '-';
  }

  const seconds = parseInt(value.toString());
  if (seconds < 60) {
    return '45s';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;
  const finalMinutes = remainingSeconds <= 30 ? minutes : minutes + 1;

  return `${finalMinutes}${finalMinutes > 1 ? 'mins' : 'min'}`;
}
