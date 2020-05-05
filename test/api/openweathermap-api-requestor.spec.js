// @flow

import chai, { expect } from 'chai';
import chaiSinon from 'sinon-chai';
import { spy } from 'sinon';

import OpenweatherMapApiRequestor, {
  validateApiData
} from '../../src/api/openweathermap-api-requestor';
import response from '../_fixtures/response.json';

chai.use(chaiSinon);

describe('OpenweatherMapApiRequestor', () => {
  describe('fetch', () => {
    let services;

    const createOpenweatherMapApiRequestor = () => {
      // $FlowFixMe service type
      return new OpenweatherMapApiRequestor(services);
    };

    beforeEach(() => {
      services = {
        apiRequestor: {
          fetch: spy(() => response)
        },
        process: {
          env: { OPENWEATHERMAP_API_KEY: 'key' }
        }
      };
    });

    it('should request data for Paris', async () => {
      const apiRequestor = createOpenweatherMapApiRequestor();

      const city = 'Paris';

      await apiRequestor.fetch(city);
      expect(services.apiRequestor.fetch).to.have.been.calledOnce;
      const fetchArg = services.apiRequestor.fetch.getCall(0).args[0];
      expect(fetchArg).to.contain('Paris');
    });

    it('should request data for Paris in metric units', async () => {
      const apiRequestor = createOpenweatherMapApiRequestor();

      const city = 'Paris';

      await apiRequestor.fetch(city);
      expect(services.apiRequestor.fetch).to.have.been.calledOnce;
      const fetchArg = services.apiRequestor.fetch.getCall(0).args[0];
      expect(fetchArg).to.contain('&units=metric');
    });

    it('should get 25.2 degress for Paris', async () => {
      const apiRequestor = createOpenweatherMapApiRequestor();

      const city = 'Paris';

      const data = await apiRequestor.fetch(city);
      const temp = data && data.main && data.main.temp;
      expect(temp).to.equal(25.2);
    });
  });

  describe('validateApiData', () => {
    it('should throw error for no data', () => {
      expect(validateApiData).to.throw('Invalid API response.');
    });

    it('should throw error for data without main section', () => {
      expect(() => validateApiData({ base: 'asd' })).to.throw(
        'Invalid API response.'
      );
    });

    it('should throw error for data without temp in main secion', () => {
      expect(() => validateApiData({ main: {} })).to.throw(
        'Invalid API response.'
      );
    });

    it('should not throw error for data with temp in main secion', () => {
      expect(() => validateApiData({ main: { temp: 20 } })).to.not.throw;
    });
  });
});
