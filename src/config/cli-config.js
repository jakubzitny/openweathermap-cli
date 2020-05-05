// @flow

export default {
  c: {
    alias: 'city',
    describe: 'Specify the city',
    type: 'string'
  },
  z: {
    alias: 'zip',
    describe: 'Specify the zip code',
    type: 'string'
  },
  l: {
    alias: 'latest-query',
    describe: 'Use latest query',
    type: 'boolean'
  },
  s: {
    alias: 'scale',
    describe: 'Define a scale to use',
    type: 'string',
    default: 'celsius',
    options: ['celsius', 'fahrenheit', 'c', 'f']
  },
  g: {
    alias: 'geolocation',
    describe: 'Disable geolocation (enabled by default)',
    default: true,
    type: 'boolean'
  },
  v: {
    alias: 'version',
    describe: 'Show version number',
    type: 'boolean'
  },
  h: {
    alias: 'help',
    describe: 'Show help',
    type: 'boolean'
  }
};
