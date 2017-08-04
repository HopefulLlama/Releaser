const os = require('os');

const ErrorHandler = require('../util/ErrorHandler');

function read(pathToConfig) {
  try {
    return require(pathToConfig);
  } catch(err) {
    ErrorHandler.logErrorAndSetExitCode(`Error in executing configuration file. See for more details.${os.EOL}${err}`);
    return null;
  }
}

module.exports = {
  read
};