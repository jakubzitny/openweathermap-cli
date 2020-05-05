// @flow

type ApiDataWeather = {
  id: number,
  main: string,
  description: string,
  icon: string
};

type ApiData = $Shape<{
  coord: ?{
    lon: number,
    lat: number
  },
  weather: ?Array<ApiDataWeather>,
  base: ?string,
  main: ?$Shape<{
    temp: ?number,
    temp_min: ?number,
    temp_max: ?number,
    pressure: ?number,
    humidity: ?number
  }>,
  visibility: ?number,
  wind: ?{
    speed: number,
    deg: number
  },
  clouds: ?{
    all: number
  },
  dt: ?number,
  sys: ?{
    type: number,
    id: number,
    country: string,
    sunrise: number,
    sunset: number
  },
  timezone: ?number,
  id: ?number,
  name: ?string,
  cod: ?number
}>;

type ValidatedData = {
  ...ApiData,
  main: {
    temp: number
  }
};

type Got = (url: string) => Promise<{ body: string }>;

export default class ApiRequestor {
  got: Got;

  constructor(services: { got: Got }) {
    this.got = services.got;
  }

  async fetch(city: string) {
    // TODO: warn about missing key
    const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || '';
    try {
      const urlBase = 'https://api.openweathermap.org/';
      const query = city;
      const url = `${urlBase}data/2.5/weather?q=${query}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
      const response = await this.got(url);
      // console.log(response.body);

      return JSON.parse(response.body);
    } catch (error) {
      // console.log(error.response.body);
    }
  }
}

export const validateApiData = (data?: ApiData): ValidatedData => {
  if (!data || !data.main || data.main.temp == null) {
    throw new Error('Invalid API response.');
  }

  // $FlowFixMe
  return data;
};
