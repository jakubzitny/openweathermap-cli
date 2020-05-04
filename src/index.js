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

const initCliParser = async (city: ?string = null) => {
  const cliParser = require('./cli-parser');
  const { interactive, parsedArgs } = cliParser.parseCliArgs();
  if (!interactive) {
    return parsedArgs;
  }

  const interviewer = require('./interviewer');
  const args = await interviewer.startConversation(parsedArgs, city);

  return args;
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
  const args = initCliParser(city);
  // TODO: save config

  const data = await fetcher(args.city); // TODO
  // TODO validate data
  const temp = convertScale(data.main.temp, args.scale);
  console.log(temp);
};

try {
  main();
} catch (e) {
  console.error(e);
}
