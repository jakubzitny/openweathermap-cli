// @flow

type ApiDataWeather = {
  id: number,
  main: string,
  description: string,
  icon: string
};

export type ApiData = $Shape<{
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

export type ValidatedData = {
  ...ApiData,
  main: {
    temp: number
  }
};
