// @flow

export const convertScale = (
  temp: number,
  scale: 'celsius' | 'fahrenheit' = 'celsius'
) => {
  if (scale === 'celsius') {
    return temp;
  }

  const fahrenheitTemp = (temp * 9) / 5 + 32;
  return (fahrenheitTemp * 100) / 100;
};
