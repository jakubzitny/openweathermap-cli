// @flow

import path from 'path';

import typeof Yargs from 'yargs';
import typeof Fs from 'fs';
import typeof Os from 'os';

import cliConfig from './config/cli-config';
import { isScaleValid, allowedScales } from './utils/scale-converter';

import type Interviewer from './interviewer';
import type LocationDetector from './location-detector';
import type { Scale } from './utils/scale-converter';

export type Args = $Shape<{
  z: string,
  zip: string,
  c: string,
  city: string,
  l: boolean,
  latestQuery: boolean,
  s: Scale,
  scale: Scale,
  g: boolean,
  disableGeolocation: boolean,
  i: string,
  import: string,
  locations: Array<string>
}>;

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

  async parseImportConfig(argv: Args) {
    try {
      const multiCityConfig = await this.readFile(argv.import);
      const locations = multiCityConfig.split('\n');
      if (!locations.length || locations.length > 10) {
        throw new Error('Too many locations');
      }

      return {
        parsedArgs: argv,
        interactive: false,
        locations
      };
    } catch (e) {
      throw new Error('We had problems loading the file you imported.');
    }
  }

  async parseLatestQueryConfig() {
    const latestQueryConfigPath = this.getLatestQueryConfigPath();
    const fileConfig = await this.readLatestQueryConfig(latestQueryConfigPath);

    return {
      parsedArgs: fileConfig,
      interactive: false,
      locations: []
    };
  }

  async parseCliArgs() {
    const argv = this.yargs.options(cliConfig).argv;
    if (argv.import) {
      return this.parseImportConfig(argv);
    }
    if (argv.latestQuery) {
      return this.parseLatestQueryConfig();
    }

    if (!isScaleValid(argv.scale)) {
      throw new Error(
        `Please enter a valid scale (${allowedScales.join(', ')})`
      );
    }

    return {
      parsedArgs: argv,
      interactive: this.detectInteractivity(argv),
      locations: []
    };
  }

  async initCliParser() {
    const { interactive, parsedArgs, locations } = await this.parseCliArgs();
    if (!interactive) {
      return { ...parsedArgs, locations };
    }

    const detectedCity = !parsedArgs.disableGeolocation
      ? await this.locationDetector.detectLocation()
      : null;
    const args = await this.interviewer.startConversation(
      parsedArgs,
      detectedCity
    );

    return args;
  }

  getLatestQueryConfigDir() {
    const HOME_DIR_SUBDIR = '.openweather';
    return path.join(this.os.homedir(), HOME_DIR_SUBDIR);
  }

  getLatestQueryConfigPath() {
    return path.join(this.getLatestQueryConfigDir(), 'latest-query.json');
  }

  async saveConfig(args: Args) {
    const dirPath = this.getLatestQueryConfigDir();
    const filePath = this.getLatestQueryConfigPath();

    try {
      await this.ensureDir(dirPath);
      await this.writeFile(filePath, args);
    } catch (e) {
      console.error('We had problems with saving your config', e);
    }
  }

  readLatestQueryConfig(configPath: string) {
    try {
      return this.readConfigFile(configPath);
    } catch (e) {
      console.debug(e);
      throw new Error('We had problems with reading your config');
    }
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

  async readConfigFile(configPath: string): Promise<Args> {
    const data = await this.readFile(configPath);
    return JSON.parse(data);
  }

  readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data.toString());
      });
    });
  }
}
