// @flow

import chai, { expect } from 'chai';
import chaiSinon from 'sinon-chai';
import { spy } from 'sinon';

import ApiRequestor, { validateApiData } from '../src/api-requestor';
import responseFixture from './fixtures/response.json';

chai.use(chaiSinon);

const responseBody = JSON.stringify(responseFixture);

describe('ApiRequestor', () => {
  describe('fetch', () => {
    const createApiRequestor = (services) => {
      return new ApiRequestor(services);
    };

    it('should request data for Paris', async () => {
      const got = spy(() => ({ body: responseBody }));
      const apiRequestor = createApiRequestor({ got });

      const city = 'Paris';

      await apiRequestor.fetch(city);
      expect(got).to.have.been.calledOnce;
      expect(got.getCall(0).args[0]).to.contain('Paris');
    });

    it('should request data for Paris in metric units', async () => {
      const got = spy(() => ({ body: responseBody }));
      const apiRequestor = createApiRequestor({ got });

      const city = 'Paris';

      await apiRequestor.fetch(city);
      expect(got).to.have.been.calledOnce;
      expect(got.getCall(0).args[0]).to.contain('&units=metric');
    });

    it('should get 25.2 degress for Paris', async () => {
      const got = spy(() => ({ body: responseBody }));
      const apiRequestor = createApiRequestor({ got });

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
      expect(() => validateApiData({ base: 'asd' })).to.throw('Invalid API response.');
    });

    it('should throw error for data without temp in main secion', () => {
      expect(() => validateApiData({ main: {} })).to.throw('Invalid API response.');
    });

    it('should not throw error for data with temp in main secion', () => {
      expect(() => validateApiData({ main: { temp: 20 } })).to.not.throw;
    });
  });
});
