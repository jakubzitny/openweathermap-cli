// @flow

import {
  OPENWEATHERMAP_API_URLBASE,
  OPENWEATHERMAP_API_UNITS
} from '../config/openweathermap-api-config';

import type ApiRequestor from './api-requestor';
import type { ApiData, ValidatedData } from './openweathermap-api-data.type';

export default class OpenWeatherMapApiRequestor {
  apiRequestor: *;

  process: *;

  constructor(services: { apiRequestor: ApiRequestor, process: Process }) {
    this.apiRequestor = services.apiRequestor;
    this.process = services.process;
  }

  buildApiUrl(city: string, apiKey: string) {
    const urlPath = 'data/2.5/weather';
    const query = `q=${city}&appid=${apiKey}&units=${OPENWEATHERMAP_API_UNITS}`;

    return `${OPENWEATHERMAP_API_URLBASE}${urlPath}?${query}`;
  }

  fetch(city: string) {
    const apiKey = this.process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      throw new Error('We could not find OpenWeatherMap API key in your env');
    }

    try {
      const url = this.buildApiUrl(city, apiKey);
      return this.apiRequestor.fetch(url);
    } catch (error) {
      console.debug('Error when calling OWM API', error);
      throw new Error('There is a problem with calling the OpenWeatherMap API');
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
