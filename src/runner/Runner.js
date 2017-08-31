const path = require('path');

const winston = require('winston');

const Configuration = require('../config/Configuration');
const ConfigurationReader = require('../reader/ConfigurationReader');
const ErrorHandler = require('../util/ErrorHandler');
const MetadataHandler = require('../reader/MetadataHandler');

function validate(pathToConfig, newVersion) {
  if(pathToConfig !== undefined && newVersion !== undefined) {
    return true;
  } else {
    ErrorHandler.logErrorAndSetExitCode('Usage: llama-rlsr <config-file> <version>');
    return false;
  }
}

function normalizePath(pathToFile) {
  return path.resolve(process.cwd(), pathToFile);
}

function run(pathToConfig, newVersion) {
  let success = false;

  if(validate(pathToConfig, newVersion)) {
    let actualPath = normalizePath(pathToConfig);

    winston.info(`Reading configuration file: ${actualPath}`);
    let config = new Configuration(ConfigurationReader.read(actualPath));
    if(config.isValid()) {
      winston.info('Reading llama-rlsr metadata.');
      let versionMetadata = MetadataHandler.read(newVersion);

      if(versionMetadata !== null) {
        winston.info('Executing configuration.');

        winston.info('Executing pre-release steps.');
        config.preRelease.execute(versionMetadata);
        winston.info('Pre-release steps finished execution.');

        winston.info('Updating llama-rlsr metadata.');
        if(MetadataHandler.write(newVersion)) {
          winston.info('Executing release steps.');
          config.release.execute(versionMetadata);
          winston.info('Release steps finished execution.');        
          winston.info('llama-rlsr finished execution.');

          success = true;
        }
      }
    }
  }

  return success;
}

module.exports = {
  run
};