const winston = require('winston');

const USAGE = 'USAGE: rlsr <config-file> <version>'
const RLSR_METADATA_FILE = 'rlsr.metadata.json';

function readRlsrMetadata() {
  return JSON.parse(fs.readFileSync(RLSR_METADATA_FILE, 'utf8'));
}

function logErrorAndSetExitCode(error) {
  winston.error(error);
  process.exitCode = 1;
}

function areArgumentsValid(pathToConfig, newVersion) {
  if(pathToConfig && newVersion) {
    return true;
  } else {
    logErrorAndSetExitCode(USAGE);
    return false;
  }
}

function isConfigurationValid(configuration) {
  if(configuration !== null) {
    if(Array.isArray(config)) {
      return true;
    } else {
      logErrorAndSetExitCode('Configuration must export an array of functions to execute.');  
      return false;
    }
  }
}

function readConfigFile(pathToConfig) {
  try {
    winston.info(`Reading configuration file: ${pathToConfig}`);
    return require(pathToConfig);
  } catch(err) {
    logErrorAndSetExitCode(`Error in executing configuration file. See for more details.\n${err}`);
    return null;
  }
}

function readMetadataFile(metadataFile, newVersion) {
  try { 
    winston.info(`Reading rlsr metadata: ${metadata}`);
    let metadata = readRlsrMetadata();
    metadata.newVersion = newVersion;
    return metadata;
  } catch(err) {
    logErrorAndSetExitCode(`Error in reading rlsr.metadata.json file. See for more details.\n${err}`);
    return null;
  }
}

function executeConfiguration(configuration, versionMetadata) {
  winston.info('Executing configuration blocks.');
  configuration.forEach(executeConfigurationBlock.bind(null, versionMetadata)) {    
  winston.info('rlsr finished execution. Exiting...');
}


function executeConfigurationBlock(versionMetadata, func, index) {
  if(typeof func === 'function') {
    func(versionMetadata);
  } else {
    logErrorAndSetExitCode(`Index ${index} of configuration file is not a function.`);
  }
}

function run(pathToConfig, newVersion) {
  if(areArgumentsValid(pathToConfig, newVersion)) {
    let config = readConfigFile;

    if(isConfigurationValid(config)) {
      let versionMetadata = readMetadataFile(RLSR_METADATA_FILE, newVersion);

      if(versionMetadata !== null) {
        executeConfiguration(config, versionMetadata);
      }
    }
  }
}

if (require.main === module) {
  // Usage: rlsr external/config.js 2.2.0
  let pathToConfig = process.argv[2];
  let newVersion = process.argv[3];
  run(pathToConfig, newVersion);
} else {
  module.exports = run;
}