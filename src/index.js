// @flow

import fs from 'fs';
import os from 'os';
import readline from 'readline';

import got from 'got';
import yargs from 'yargs';

import Interviewer from './interviewer';
import OpenWeatherMapApiRequestor, {
  validateApiData
} from './api/openweathermap-api-requestor';
import ApiRequestor from './api/api-requestor';
import CliParser from './cli-parser';
import { detectLocation } from './location-detector';
import { convertScale } from './utils/scale-converter';

const initServices = () => {
  const interviewerServices = {
    readline,
    process // NOTE: Node global
  };

  const interviewer = new Interviewer(interviewerServices);
  const apiRequestor = new ApiRequestor({ got });
  const openWeatherMapApiRequestor = new OpenWeatherMapApiRequestor({
    apiRequestor,
    process
  });

  const cliParserServices = {
    fs,
    interviewer,
    os,
    yargs
  };

  const cliParser = new CliParser(cliParserServices);

  return {
    cliParser,
    interviewer,
    openWeatherMapApiRequestor
  };
};

const main = async () => {
  const services = initServices();

  const detectedLocation = detectLocation();
  const args = await services.cliParser.initCliParser(detectedLocation);

  try {
    // NOTE: Try saving config, continue if it fails.
    services.cliParser.saveConfig(args);
  } catch (configError) {
    console.warn('There is a problem with saving your config', configError);
  }

  try {
    const data = await services.openWeatherMapApiRequestor.fetch(
      args.city || args.c || args.zip || args.z
    );
    const validatedData = validateApiData(data);
    const temp = convertScale(validatedData.main.temp, args.scale);
    console.log(temp);
  } catch (error) {
    console.error(error);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
