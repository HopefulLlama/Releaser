const winston = require('winston');

const Configuration = require('./reader/Configuration');
const ConfigurationReader = require('./reader/ConfigurationReader');
const ErrorHandler = require('./util/ErrorHandler');
const MetadataReader = require('./reader/MetadataReader');

function validate(pathToConfig, newVersion) {
  if(pathToConfig !== undefined && newVersion !== undefined) {
    return true;
  } else {
    ErrorHandler.logErrorAndSetExitCode('Usage: llama-rlsr <config-file> <version>');
    return false;
  }
}

function run(pathToConfig, newVersion) {
  if(validate(pathToConfig, newVersion)) {
    winston.info(`Reading configuration file: ${pathToConfig}`);
    let config = new Configuration(ConfigurationReader.read(pathToConfig));

    if(config.isValid()) {
      winston.info(`Reading llama-rlsr metadata`);
      let versionMetadata = MetadataReader.read(newVersion);

      if(versionMetadata !== null) {
        winston.info('Executing configuration blocks.');
        config.execute(versionMetadata);
        winston.info('llama-rlsr finished execution. Exiting...');
        return true;
      }
    }
  }

  return false;
}

if (require.main === module) {
  // Usage: llama-rlsr external/config.js 2.2.0
  let pathToConfig = process.argv[2];
  let newVersion = process.argv[3];
  run(pathToConfig, newVersion);
} else {
  module.exports = run;
}