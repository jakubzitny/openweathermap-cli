// @flow

const readline = require('readline');

type ReadlineInterface = readline.Interface;

const createReadlineInterface = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return rl;
};

const askAndGetAnswer = (rl: ReadlineInterface, question: string) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();

      resolve(answer);
    });
  });
};

const askTillCorrect = async (
  rl: ReadlineInterface,
  question: string,
  validator: (answer: string) => boolean,
  detectedCity: ?string
) => {
  const defaultAnswer = detectedCity ? `[${detectedCity}] ` : '';
  const answer = await askAndGetAnswer(rl, `${question}${defaultAnswer}`);
  if (validator(answer) || detectedCity) {
    return answer || detectedCity;
  }

  console.log('Incorrect zip code or city.');
  return askTillCorrect(rl, question, validator, detectedCity);
};

const verifyZipCode = () => {
  return true;
};

const startConversation = async (
  parsedArgs: Object,
  detectedCity?: ?string = null
) => {
  const rl = createReadlineInterface();
  const zipcode = await askTillCorrect(
    rl,
    "What's the zipcode? ",
    verifyZipCode,
    detectedCity
  );

  return {
    ...parsedArgs,
    z: zipcode,
    zip: zipcode
  };
};

module.exports = {
  startConversation
};
