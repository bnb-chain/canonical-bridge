export function toUpperAddress(address = '') {
  return address ? `0x${address.replace('0x', '').toUpperCase()}` : '';
}
