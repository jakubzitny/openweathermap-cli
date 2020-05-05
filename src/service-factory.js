// @flow

import fs from 'fs';
import os from 'os';
import readline from 'readline';

import got from 'got';
import yargs from 'yargs';

import Interviewer from './interviewer';
import OpenWeatherMapApiRequestor from './api/openweathermap-api-requestor';
import IpApiRequestor from './api/ip-api-requestor';
import ApiRequestor from './api/api-requestor';
import CliParser from './cli-parser';
import LocationDetector from './location-detector';

export function initServices() {
  const interviewerServices = {
    readline,
    process // NOTE: Node global
  };

  const interviewer = new Interviewer(interviewerServices);
  const apiRequestor = new ApiRequestor({ got });
  const ipApiRequestor = new IpApiRequestor({ apiRequestor });
  const openWeatherMapApiRequestor = new OpenWeatherMapApiRequestor({
    apiRequestor,
    process
  });

  const locationDetector = new LocationDetector({ ipApiRequestor });
  const cliParserServices = {
    fs,
    interviewer,
    locationDetector,
    os,
    yargs
  };

  const cliParser = new CliParser(cliParserServices);

  return {
    cliParser,
    interviewer,
    openWeatherMapApiRequestor,
    process
  };
}
