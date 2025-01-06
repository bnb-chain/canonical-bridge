export function isEmpty(obj?: Object) {
  return !obj || Object.entries(obj).length === 0;
}
