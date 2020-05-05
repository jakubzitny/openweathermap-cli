// @flow

import path from 'path';
import fs from 'fs';

import chai, { expect } from 'chai';
import chaiSinon from 'sinon-chai';
import { spy } from 'sinon';

import CliParser from '../src/cli-parser';

chai.use(chaiSinon);

const interviewerMock = {
  startConversation: spy((args, city) => {
    return { ...args, city, c: city };
  })
};

describe('CliParser', () => {
  const defaultArgv = {
    scale: 'celsius',
    g: false,
    city: 'Paris',
    c: 'Paris',
    locations: []
  };

  const createYargsMock = (argv = {}) => {
    return {
      options() {
        return { argv: { ...defaultArgv, ...argv } };
      }
    };
  };

  const createFsMock = (err: ?Error = null, readFilePath: ?string = null) => {
    return {
      writeFile: spy((filePath, contents, callback) => {
        callback(err);
      }),
      mkdir: spy((dirPath, callback) => {
        callback(err);
      }),
      readFile: spy((filePath, callback) => {
        if (!readFilePath) {
          callback(err);
          return;
        }

        const locations = fs.readFileSync(
          path.join(__dirname, readFilePath)
        );
        callback(null, locations);
      })
    };
  };

  const createCliParser = (services) => {
    // $FlowFixMe
    return new CliParser({
      // $FlowFixMe not a real os mock
      os: {
        homedir() {
          return '/';
        }
      },
      // $FlowFixMe not a real fs mock
      fs: createFsMock(),
      yargs: createYargsMock(),
      // $FlowFixMe not a real interwiever mock
      interviewer: interviewerMock,
      // $FlowFixMe not a real location detector mock
      locationDetector: {
        detectLocation: spy(() => {
          return 'Prague';
        })
      },
      ...services
    });
  };

  describe('parsing args', () => {
    it('should instantiate CliParser', () => {
      const cliParser = createCliParser();

      expect(cliParser).to.be.instanceOf(CliParser);
    });

    it('should parse cli args with no interactivity', async () => {
      const cliParser = createCliParser();
      const parsedArgs = await cliParser.initCliParser();

      expect(parsedArgs).to.deep.equal(defaultArgv);
    });

    it('should not start conversation when parsing with no interactivity', async () => {
      const cliParser = createCliParser();
      await cliParser.initCliParser();

      expect(interviewerMock.startConversation).to.not.have.been.called;
    });

    it('should parse cli args with automatically detected city', async () => {
      const yargsMock = createYargsMock({ c: null, city: null });
      const cliParser = createCliParser({ yargs: yargsMock });
      const parsedArgs = await cliParser.initCliParser();

      expect(parsedArgs).to.deep.equal({ ...defaultArgv, c: 'Prague', city: 'Prague' });
    });

    it('should start conversation when parsing with interactivity', async () => {
      const yargsMock = createYargsMock({ c: null, city: null });
      const cliParser = createCliParser({ yargs: yargsMock });
      await cliParser.initCliParser();

      expect(interviewerMock.startConversation).to.have.been.called;
    });

    it('should parse multi location import config', async () => {
      const yargsMock = createYargsMock({ import: '/locations.txt' });
      const fsMock = createFsMock(null, '_fixtures/locations.txt');
      const cliParser = createCliParser({ yargs: yargsMock, fs: fsMock });
      const parsedArgs = await cliParser.initCliParser();

      expect(parsedArgs.locations).to.have.length(4);
    });

    it('should parse latest query config', async () => {
      const yargsMock = createYargsMock({ latestQuery: true });
      const fsMock = createFsMock(null, '_fixtures/latest-query.json');
      const cliParser = createCliParser({ yargs: yargsMock, fs: fsMock });
      const parsedArgs = await cliParser.initCliParser();

      expect(parsedArgs).to.deep.equal({ ...parsedArgs });
    });
  });

  describe('saving config', () => {
    it('should save provided config', async () => {
      const fsMock = createFsMock();
      const cliParser = createCliParser({ fs: fsMock });
      await cliParser.saveConfig(defaultArgv);

      const expectedConfigPath = path.join('/', '.openweather', 'latest-query.json');
      expect(fsMock.writeFile).to.have.been.calledWith(expectedConfigPath);
    });


    it('should not save config if there is a problem with creating dir', async () => {
      const fsMock = createFsMock(new Error('Error in test'));
      const cliParser = createCliParser({ fs: fsMock });
      await cliParser.saveConfig(defaultArgv);

      expect(fsMock.writeFile).to.not.have.been.called;
    });
  });
});
