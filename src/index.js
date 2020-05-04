// @flow

const got = require('got');

const fetcher = async (city: string) => {
  // TODO: warn about missing key
  const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || '';
  try {
    const urlBase = 'https://api.openweathermap.org/';
    const query = city;
    const url = `${urlBase}data/2.5/weather?q=${query}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await got(url);
    // console.log(response.body);

    return JSON.parse(response.body);
  } catch (error) {
    console.log(error.response.body);
  }
};

type ApiDataWeather = {
  id: number,
  main: string,
  description: string,
  icon: string
};

export type ApiData = {
  coord: {
    lon: number,
    lat: number
  },
  weather: Array<ApiDataWeather>,
  base: string,
  main: {
    temp: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number
  },
  visibility: number,
  wind: {
    speed: number,
    deg: number
  },
  clouds: {
    all: number
  },
  dt: number,
  sys: {
    type: number,
    id: number,
    country: string,
    sunrise: number,
    sunset: number
  },
  timezone: number,
  id: number,
  name: string,
  cod: number
};

const validateApiData = (data?: ApiData) => {
  if (!data || !data.main || !data.main.temp) {
    throw new Error('Invalid API response.');
  }

  return data;
};

const locationDetector = () => {
  return null; // 'Paris'
};

const initCliParser = async () => {
  const cliParser = require('./cli-parser');
  const { interactive, parsedArgs } = cliParser.parseCliArgs();
  if (!interactive) {
    return parsedArgs;
  }

  const city = locationDetector();
  const interviewer = require('./interviewer');
  const args = await interviewer.startConversation(parsedArgs, city);

  return args;
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
  const args = await initCliParser();
  // TODO: save config

  try {
    const data = await fetcher(args.city || args.zip);
    const validatedData = validateApiData(data);
    const temp = convertScale(validatedData.main.temp, args.scale);
    console.log(temp);
  } catch (e) {
    console.error(e);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
