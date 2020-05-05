// @flow

import IpApiRequestor from './api/ip-api-requestor';

export default class LocationDetector {
  ipApiRequestor: *;

  constructor(services: { ipApiRequestor: IpApiRequestor }) {
    this.ipApiRequestor = services.ipApiRequestor;
  }

  async detectLocation() {
    try {
      const ipApiResponse = await this.ipApiRequestor.fetch();
      return ipApiResponse.city || null;
    } catch (error) {
      console.debug('Error when calling IP API.');
      return null;
    }
  }
}
