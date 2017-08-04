const winston = require('winston');

function logErrorAndSetExitCode(error) {
  winston.error(error);
  process.exitCode = 1;
}

module.exports = {
  logErrorAndSetExitCode
};