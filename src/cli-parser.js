// @flow

const yargs = require('yargs');

// const verifyCliArgs = () => {
//   return true;
// };

const detectInteractivity = (parsedArgs: Object) => {
  return !(parsedArgs.l || parsedArgs.c || parsedArgs.z);
};

const parseCliArgs = () => {
  const cliConfig = require('./config/cli-config');
  const argv = yargs.options(cliConfig).argv;

  // console.debug(argv);

  return {
    parsedArgs: argv,
    scale: argv.scale,
    interactive: detectInteractivity(argv)
  };
};

module.exports = {
  parseCliArgs
};
