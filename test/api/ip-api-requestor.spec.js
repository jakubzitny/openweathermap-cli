// @flow

import chai, { expect } from 'chai';
import chaiSinon from 'sinon-chai';
import { spy } from 'sinon';

import IpApiRequestor from '../../src/api/ip-api-requestor';
import response from '../_fixtures/ip-api-response.json';

chai.use(chaiSinon);

describe('IpApiRequestor', () => {
  let services;

  const createIpApiRequestor = () => {
    // $FlowFixMe service type
    return new IpApiRequestor(services);
  };

  beforeEach(() => {
    services = {
      apiRequestor: {
        fetch: spy(() => response)
      }
    };
  });

  it('should request ip data', async () => {
    const apiRequestor = createIpApiRequestor();

    await apiRequestor.fetch();
    expect(services.apiRequestor.fetch).to.have.been.calledOnce;
    const fetchArg = services.apiRequestor.fetch.getCall(0).args[0];
    expect(fetchArg).to.equal('http://ip-api.com/json');
  });

  it('should get ip data for Prague', async () => {
    const apiRequestor = createIpApiRequestor();

    const data = await apiRequestor.fetch();
    expect(data.city).to.equal('Prague');
  });
});
