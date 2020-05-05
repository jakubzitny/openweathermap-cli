# OpenWeatherMap CLI

[![Build Status](https://api.travis-ci.org/jakubzitny/openweathermap-cli.svg?branch=master)](https://travis-ci.org/jakubzitny/openweathermap-cli) [![codecov](https://codecov.io/gh/jakubzitny/openweathermap-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/jakubzitny/openweathermap-cli) [![Known Vulnerabilities](https://snyk.io/test/github/jakubzitny/openweathermap-cli/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jakubzitny/openweathermap-cli?targetFile=package.json) [![Maintainability](https://api.codeclimate.com/v1/badges/763a96ad2b22c087d64c/maintainability)](https://codeclimate.com/github/jakubzitny/openweathermap-cli/maintainability)

Display weather info for a city from OpenWeatherMap API, interactively, from command line or from a config.

![example](https://i.imgur.com/DWfheL7.gif)

## Usage

Make sure you have `OPENWEATHERMAP_API_KEY` in env when running this app. Get them at [openweathermap.org](https://home.openweathermap.org/api_keys). For convenience, alias `yarn start` or `node bin/index.js` to `openweathermap-cli`, exact steps are at the bottom of this README.

Examples:

- `openweathermap-cli # no args` - will ask interactively for a location with detected current city
- `openweathermap-cli -c Paris` - will provide info for Paris in °C (default)
- `openweathermap-cli --city Prague -scale fahrenheit` - will provide info for Prague in °F
- `openweathermap-cli -l` - will repeat the latest query
- `openweathermap-cli -i locations.txt` - will provide info for locations from a text file
- `openweathermap-cli --disable-geolocation` - will ask interactively without asking for a location



### Options

```
Options:
  -c, --city                 Specify the city                           [string]
  -z, --zip                  Specify the zip code                       [string]
  -l, --latest-query         Use latest query                          [boolean]
  -s, --scale                Define a scale to use [string] [default: "celsius"]
  -g, --disable-geolocation  Disable geolocation (enabled by default)
                                                      [boolean] [default: false]
  -i, --import               Import a file with multiple locations      [string]
  -v, --version              Show version number                       [boolean]
  -h, --help                 Show help                                 [boolean]
```

### Multiple locations config file

Specify up to 10 different cities or zip codes from a file (e.g. `locations.txt`), each on a separate line, and import with `-i` flag.

```
Paris
Barcelona
Prague
```


## Stack

- Node.js (v12 LTS), Yarn, Babel, Flow
- ESlint, Prettier
- Jest, Chai, Sinon
- Got (requirement, used for API fetching)
- Yargs (great time saver when parsing CLI args)


## Possible improvements

- better UX (not a CLI in the ideal scenario, who looks for the weather in CLI?)
- better API (this one is slow and limited, we should create our own and connect to different providers maybe)
- better error handling, error messages, retrying, any maybe caching
- dependency injection mechanism for clearer classes and better testing
- debug / log messages (if specified from command line)
- `CliParser` class could be refactored into smaller pieces and tested more thoroughly
- integration tests


## Development

1. Clone and install

```
git clone https://github.com/jakubzitny/openweathermap-cli
cd openweathermap-cli
yarn
```

2. Build it
```
yarn build
```

3. Check and test

```
yarn flow
yarn prettier
yarn lint
yarn test
```

4. Run

```
yarn start --help

yarn start
yarn start -c Prague

# or with alias
alias openweathermap-cli="node bin/index.js"

openweathermap-cli --help
openweathermap-cli -c Prague
openweathermap-cli --city Paris -scale fahrenheit
```
