const path = require('path');

const winston = require('winston');

const Configuration = require('./reader/Configuration');
const ConfigurationReader = require('./reader/ConfigurationReader');
const ErrorHandler = require('./util/ErrorHandler');
const MetadataHandler = require('./reader/MetadataHandler');

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
  if(validate(pathToConfig, newVersion)) {
  	let actualPath = normalizePath(pathToConfig);

    winston.info(`Reading configuration file: ${actualPath}`);
    let config = new Configuration(ConfigurationReader.read(actualPath));

    if(config.isValid()) {
      winston.info('Reading llama-rlsr metadata.');
      let versionMetadata = MetadataHandler.read(newVersion);

      if(versionMetadata !== null) {
        winston.info('Executing configuration blocks.');
        config.execute(versionMetadata);
        winston.info('llama-rlsr finished execution.');

        winston.info('Updating llama-rlsr metadata.');
        return MetadataHandler.write(newVersion);
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