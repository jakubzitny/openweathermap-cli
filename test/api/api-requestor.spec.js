// @flow

import chai, { expect } from 'chai';
import chaiSinon from 'sinon-chai';
import { spy } from 'sinon';

import ApiRequestor from '../../src/api/api-requestor';
import responseFixture from '../_fixtures/response.json';

chai.use(chaiSinon);

const responseBody = JSON.stringify(responseFixture);

describe('ApiRequestor', () => {
  const createApiRequestor = (services) => {
    return new ApiRequestor(services);
  };

  it('should fetch data from url', async () => {
    const got = spy(() => ({ body: responseBody }));
    const apiRequestor = createApiRequestor({ got });

    const url = 'https://example.com';

    await apiRequestor.fetch(url);
    expect(got).to.have.been.calledOnce;
    expect(got.getCall(0).args[0]).to.equal(url);
  });

  it('should fail to fetch data from url', async () => {
    const error = new Error('failed in test');
    const got = spy(() => {
      throw error;
    });
    const apiRequestor = createApiRequestor({ got });

    const url = 'https://example.com';

    try {
      await apiRequestor.fetch(url);
    } catch (catchedError) {
      expect(catchedError).to.equal(error);
    }
  });

  it('should fail to parse fetched data from url', async () => {
    const got = spy(() => 'not a valid json response');
    const apiRequestor = createApiRequestor({ got });

    const url = 'https://example.com';

    try {
      await apiRequestor.fetch(url);
    } catch (catchedError) {
      console.log(catchedError);
      expect(catchedError.message).to.equal(
        'Unexpected token u in JSON at position 0'
      );
    }
  });
});
