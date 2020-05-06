// @flow

import { expect } from 'chai';

import { convertScale, formatScale, isScaleValid } from '../../src/utils/scale-converter';

describe('convertScale', () => {
  it('should keep provided temp value in celsius by default', () => {
    expect(convertScale(20)).to.equal(20);
  });

  it('should keep provided temp value in celsius if celsius is specified', () => {
    expect(convertScale(20, 'celsius')).to.equal(20);
  });

  it('should keep convert celsius to fahrenheit if fahrenheit is specified', () => {
    expect(convertScale(20, 'fahrenheit')).to.equal(68);
  });

  it('should return °C for celsius', () => {
    expect(formatScale('celsius')).to.equal('°C');
  });

  it('should return °F for fahrenheit', () => {
    expect(formatScale('fahrenheit')).to.equal('°F');
  });

  it('should validate celsius scale value', () => {
    expect(isScaleValid('celsius')).to.be.true;
  });

  it('should validate c scale value', () => {
    expect(isScaleValid('c')).to.be.true;
  });

  it('should validate fahrenheit scale value', () => {
    expect(isScaleValid('fahrenheit')).to.be.true;
  });

  it('should validate f scale value', () => {
    expect(isScaleValid('f')).to.be.true;
  });

  it('should not validate invalid scale value', () => {
    // $FlowFixMe make sure the utils is tested in runtime
    expect(isScaleValid('invalid')).to.be.false;
  });
});
