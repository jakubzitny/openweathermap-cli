// @flow

import { expect } from 'chai';

import { detectLocation } from '../src/location-detector';


describe('convertScale', () => {
  it('should not detect any location', () => {
    expect(detectLocation()).to.equal(null);
  });
});
