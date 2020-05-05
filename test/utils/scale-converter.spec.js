// @flow

import { expect } from 'chai';

import { convertScale, formatScale } from '../../src/utils/scale-converter';

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
});
