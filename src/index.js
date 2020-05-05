// @flow

import fs from 'fs';
import os from 'os';
import readline from 'readline';

import got from 'got';
import yargs from 'yargs';

import Interviewer from './interviewer';
import ApiRequestor, { validateApiData } from './api-requestor';
import CliParser from './cli-parser';
import { detectLocation } from './location-detector';
import { convertScale } from './utils/scale-converter';

const initServices = () => {
  const interviewerServices = {
    readline,
    process // NOTE: Node global
  };

  const interviewer = new Interviewer(interviewerServices);
  return {
    interviewer,
    fs,
    readline,
    os,
    got,
    yargs
  };
};

const main = async () => {
  const services = initServices();

  const detectedLocation = detectLocation();
  const cliParser = new CliParser(services);
  const args = await cliParser.initCliParser(detectedLocation);

  try {
    // NOTE: Try saving config, continue if it fails.
    cliParser.saveConfig(args);
  } catch (configError) {
    console.warn('There is a problem with saving your config', configError);
  }

  try {
    const apiRequestor = new ApiRequestor(services);
    const data = await apiRequestor.fetch(args.city || args.zip);
    const validatedData = validateApiData(data);
    const temp = convertScale(validatedData.main.temp, args.scale);
    console.log(temp);
  } catch (e) {
    console.error(e);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
