// @flow

export type Scale = 'c' | 'f' | 'celsius' | 'fahrenheit';

export const allowedScales = ['c', 'f', 'celsius', 'fahrenheit'];
const DEFAULT_SCALE = 'celsius';

export const convertScale = (temp: number, scale: Scale = DEFAULT_SCALE) => {
  if (scale === 'celsius' || scale === 'c') {
    return temp;
  }

  const fahrenheitTemp = (temp * 9) / 5 + 32;
  return Math.round(fahrenheitTemp * 100) / 100;
};

export const formatScale = (scale: Scale = DEFAULT_SCALE) => {
  if (scale === 'celsius' || scale === 'c') {
    return '°C';
  }

  return '°F';
};

export const isScaleValid = (scale: Scale) => {
  return allowedScales.indexOf(scale) !== -1;
};
