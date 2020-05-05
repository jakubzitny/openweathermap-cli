// @flow

import type ApiRequestor from './api-requestor';

export default class IpApiRequestor {
  apiRequestor: *;

  constructor(services: { apiRequestor: ApiRequestor }) {
    this.apiRequestor = services.apiRequestor;
  }

  buildApiUrl() {
    return 'http://ip-api.com/json';
  }

  fetch() {
    const url = this.buildApiUrl();
    return this.apiRequestor.fetch(url);
  }
}
