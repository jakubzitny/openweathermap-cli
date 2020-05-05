// @flow

import {
  OPENWEATHERMAP_API_URLBASE,
  OPENWEATHERMAP_API_UNITS
} from '../config/openweathermap-api-config';

import type ApiRequestor from './api-requestor';
import type { ApiData, ValidatedData } from './openweathermap-api-data.type';

export default class OpenWeatherMapApiRequestor {
  apiRequestor: *;

  apiKey: *;

  constructor(services: { apiRequestor: ApiRequestor, apiKey: ?string }) {
    this.apiRequestor = services.apiRequestor;
    this.apiKey = services.apiKey;
  }

  buildApiUrl(city: string, apiKey: string) {
    const urlPath = 'data/2.5/weather';
    const query = `q=${city}&appid=${apiKey}&units=${OPENWEATHERMAP_API_UNITS}`;

    return `${OPENWEATHERMAP_API_URLBASE}${urlPath}?${query}`;
  }

  async fetch(city: string) {
    const apiKey = this.apiKey;
    if (!apiKey) {
      throw new Error('We could not find OpenWeatherMap API key in your env');
    }

    try {
      const url = this.buildApiUrl(city, apiKey);
      const response = await this.apiRequestor.fetch(url);

      return response;
    } catch (error) {
      if (error.message.indexOf('404') !== -1) {
        throw new Error('We could not find the location you requested.');
      }

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
