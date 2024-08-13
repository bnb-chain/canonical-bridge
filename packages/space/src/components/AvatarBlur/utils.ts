export const hashCode = (name: string) => {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    var character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32 bit integer.
  }
  return Math.abs(hash);
};

export const getDigit = (number: number, ntn: number) => {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
};

export const getUnit = (number: number, range: number, index: number) => {
  let value = number % range;

  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  } else return value;
};

export const getRandomColor = (number: number, colors: `#${string}`[], range: number) => {
  return colors[number % range];
};
