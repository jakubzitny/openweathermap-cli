// @flow

export type Scale = 'celsius' | 'fahrenheit'

const DEFAULT_SCALE = 'celsius';

export const convertScale = (
  temp: number,
  scale: Scale = DEFAULT_SCALE
) => {
  if (scale === 'celsius') {
    return temp;
  }

  const fahrenheitTemp = (temp * 9) / 5 + 32;
  return (fahrenheitTemp * 100) / 100;
};

export const formatScale = (scale: Scale = DEFAULT_SCALE) => {
  if (scale === 'celsius') {
    return '°C';
  }

  return '°F';
};
