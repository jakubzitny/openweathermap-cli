// @flow

import path from 'path';

import typeof Yargs from 'yargs';
import typeof Fs from 'fs';
import typeof Os from 'os';

import cliConfig from './config/cli-config';

import type Interviewer from './interviewer';
import type LocationDetector from './location-detector';
import type { Scale } from './utils/scale-converter';

type Args = $Shape<{
  z: string,
  zip: string,
  c: string,
  city: string,
  l: boolean,
  latestQuery: boolean,
  s: Scale,
  scale: Scale,
  g: boolean,
  disableGeolocation: boolean
}>;

// const verifyCliArgs = () => {
//   return true;
// };

export default class CliParser {
  fs: *;

  interviewer: *;

  locationDetector: *;

  os: *;

  yargs: *;

  constructor(services: {
    fs: Fs,
    os: Os,
    interviewer: Interviewer,
    locationDetector: LocationDetector,
    yargs: Yargs
  }) {
    this.fs = services.fs;
    this.locationDetector = services.locationDetector;
    this.os = services.os;
    this.interviewer = services.interviewer;
    this.yargs = services.yargs;
  }

  detectInteractivity(parsedArgs: Args) {
    return !(parsedArgs.l || parsedArgs.c || parsedArgs.z);
  }

  parseCliArgs() {
    const argv = this.yargs.options(cliConfig).argv;

    return {
      parsedArgs: argv,
      interactive: this.detectInteractivity(argv)
    };
  }

  async initCliParser() {
    const { interactive, parsedArgs } = this.parseCliArgs();
    if (!interactive) {
      return parsedArgs;
    }

    const detectedCity = !parsedArgs.disableGeolocation ?
      await this.locationDetector.detectLocation() :
      null;
    const args = await this.interviewer.startConversation(
      parsedArgs,
      detectedCity
    );

    return args;
  }

  ensureDir(dirPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fs.mkdir(dirPath, (err) => {
        if (!err || err.code === 'EEXIST') {
          resolve();
        }

        reject();
      });
    });
  }

  writeFile(filePath: string, contents: Args): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const serializedContents = JSON.stringify(contents);
        this.fs.writeFile(filePath, serializedContents, (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async saveConfig(args: Args) {
    const HOME_DIR_SUBDIR = '.openweather';
    const dirPath = path.join(this.os.homedir(), HOME_DIR_SUBDIR);
    const filePath = path.join(dirPath, 'config.json');

    try {
      await this.ensureDir(dirPath);
      await this.writeFile(filePath, args);
    } catch (e) {
      console.error('We had problems with saving your config', e);
    }
  }
}
