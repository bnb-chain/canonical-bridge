/* eslint-disable no-console */
export const storage = {
  set(key: string, value: any) {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.log(err);
    }
  },

  get(key: string, defaultValue?: any) {
    if (typeof window === 'undefined') return defaultValue;

    let value = defaultValue;
    try {
      const valueStr = window.localStorage.getItem(key);
      if (valueStr) {
        value = JSON.parse(valueStr);
      }
    } catch (err) {
      console.log(err);
    }
    return value;
  },
};
