// @flow

import path from 'path';

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
    c: 'Paris'
  };

  const createYargsMock = (argv = {}) => {
    return {
      options() {
        return { argv: { ...defaultArgv, ...argv } };
      }
    };
  };

  const createFsMock = (err: ?Error = null) => {
    return {
      writeFile: spy((filePath, contents, callback) => {
        callback(err);
      }),
      mkdir: spy((dirPath, callback) => {
        callback(err);
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
  });

  describe('saving config', () => {
    it('should save provided config', async () => {
      const fsMock = createFsMock();
      const cliParser = createCliParser({ fs: fsMock });
      await cliParser.saveConfig(defaultArgv);

      const expectedConfigPath = path.join('/', '.openweather', 'config.json');
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
