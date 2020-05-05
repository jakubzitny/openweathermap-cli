// @flow

import { expect } from 'chai';

import LocationDetector from '../src/location-detector';


describe('LocationDetector', () => {
  const createLocationDetector = (city: ?string | Error = null) => {
    return new LocationDetector({
      // $FlowFixMe not a real mock
      ipApiRequestor: {
        async fetch() {
          if (city instanceof Error) {
            throw city;
          }

          return { city };
        }
      }
    });
  };

  it('detect a location returned from api', async () => {
    const locationDetector = createLocationDetector('Prague');

    const detectedCity = await locationDetector.detectLocation();
    expect(detectedCity).to.equal('Prague');
  });

  it('detect not detect a location when api call fails', async () => {
    const locationDetector = createLocationDetector(new Error('error in test '));

    const detectedCity = await locationDetector.detectLocation();
    expect(detectedCity).to.equal(null);
  });
});
