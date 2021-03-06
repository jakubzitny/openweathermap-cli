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
    alias: 'disable-geolocation',
    describe: 'Disable geolocation (enabled by default)',
    default: false,
    type: 'boolean'
  },
  i: {
    alias: 'import',
    describe: 'Import a file with multiple locations',
    type: 'string'
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
