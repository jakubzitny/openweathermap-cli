// @flow

import typeof Readline from 'readline';

export default class Interviewer {
  process: *;

  readline: *;

  constructor(services: { process: Process, readline: Readline }) {
    this.process = services.process;
    this.readline = services.readline;
  }

  createReadlineInterface() {
    const rl = this.readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return rl;
  }

  askAndGetAnswer(rl: readline$Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();

        resolve(answer);
      });
    });
  }

  async askTillCorrect(
    question: string,
    validator: (input: string) => boolean,
    detectedCity: ?string
  ) {
    const defaultAnswer = detectedCity ? `[${detectedCity}] ` : '';
    const rl = this.createReadlineInterface();
    const answer = await this.askAndGetAnswer(
      rl,
      `${question}${defaultAnswer}`
    );
    if (validator(answer) || detectedCity) {
      return answer || detectedCity;
    }

    console.log('Incorrect zip code or city.');
    return this.askTillCorrect(question, validator, detectedCity);
  }

  verifyUserInput(input: string) {
    return Boolean(input);
  }

  async startConversation(parsedArgs: Object, detectedCity?: ?string = null) {
    const zipcode = await this.askTillCorrect(
      "What's the zipcode? ",
      this.verifyUserInput,
      detectedCity
    );

    return {
      ...parsedArgs,
      z: zipcode,
      zip: zipcode
    };
  }
}
