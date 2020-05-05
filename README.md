# OpenWeatherMap CLI

[![Build Status](https://api.travis-ci.org/jakubzitny/openweathermap-cli.svg?branch=master)](https://travis-ci.org/jakubzitny/openweathermap-cli) [![codecov](https://codecov.io/gh/jakubzitny/openweathermap-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/jakubzitny/openweathermap-cli)

Display weather info for a city from OpenWeatherMap API

## Development

1. Clone and install

```
git clone https://github.com/jakubzitny/openweathermap-cli
cd openweathermap-cli
yarn
```

2. Check and test

```
yarn flow
yarn prettier
yarn lint
yarn test
```

3. Run

```
yarn start --help

yarn start
yarn start -c Prague
```


## Stack

- Node.js, Yarn, Babel, Flow
- ESlint, Prettier
- Jest, Chai, Sinon
- Got
- Yargs
