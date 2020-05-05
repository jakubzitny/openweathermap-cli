// @flow

import chai, { expect } from 'chai';
import chaiSinon from 'sinon-chai';
import { spy } from 'sinon';

import Interviewer from '../src/interviewer';

chai.use(chaiSinon);


describe('Interviewer', () => {
  const createReadlineInterface = (answer: ?string = null, cnt: number = 1) => {
    let callCount = cnt;

    return {
      question(q: string, a: Function) {
        if (!--callCount) {
          a(answer);
          return;
        }

        a();
      },
      close() { }
    };
  };

  const createInterviewer = (readlineInterface = createReadlineInterface()) => {
    const services = {
      process,
      readline: {
        createInterface() {
          return readlineInterface;
        }
      }
    };

    // $FlowFixMe service types
    return new Interviewer(services);
  };


  it('should instantiate', () => {
    expect(createInterviewer()).to.be.instanceOf(Interviewer);
  });


  it('should start conversation and get an answer', async () => {
    const interviewer = createInterviewer(createReadlineInterface('answer'));
    await interviewer.startConversation();
  });


  it('should start conversation and get an answer on 2nd try', async () => {
    const interviewer = createInterviewer(createReadlineInterface('answer', 2));
    await interviewer.startConversation();
  });
});
