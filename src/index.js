// @flow

const got = require('got');

const fetcher = async () => {
  // TODO: warn about missing key
  const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || '';
  try {
    const urlBase = 'https://api.openweathermap.org/';
    const query = 'paris';
    const url = `${urlBase}data/2.5/weather?q=${query}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await got(url);
    // console.log(response.body);

    return JSON.parse(response.body);
  } catch (error) {
    console.log(error.response.body);
  }
};

const locationDetector = () => {
  return 'Paris';
};

const convertScale = (
  temp: number,
  scale: 'celsius' | 'fahrenheit' = 'celsius'
) => {
  if (scale === 'celsius') {
    return temp;
  }

  const fahrenheitTemp = (temp * 9) / 5 + 32;
  return (fahrenheitTemp * 100) / 100;
};

const main = async () => {
  const city = locationDetector(); // TODO
  // TODO: save config

  const data = await fetcher(city); // TODO
  // TODO validate data
  const temp = convertScale(data.main.temp);
  console.log(temp);
};

try {
  main();
} catch (e) {
  console.error(e);
}
