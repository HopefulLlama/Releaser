const winston = require('winston');

const RLSR_METADATA_FILE = 'rlsr.metadata.json';

function readRlsrMetadata() {
  return JSON.parse(fs.readFileSync(RLSR_METADATA_FILE, 'utf8'));
}

function logErrorAndSetExitCode(error) {
  winston.error(error);
  process.exitCode = 1;
}

function executeConfigurationBlock(func, index) {
  if(typeof func === 'function') {
    func(versionMetadata);
  } else {
    logErrorAndSetExitCode(`Index ${index} of configuration file is not a function.`);
  }
}

function run(pathToConfig, newVersion) {
  let config = null;

  if(pathToConfig) {
    try {
      winston.info(`Reading configuration file: ${pathToConfig}`);
      config = require(pathToConfig);
    } catch(err) {
      logErrorAndSetExitCode(`Error in executing configuration file. See for more details.\n${err}`);
      return;
    }

    if(Array.isArray(config)) {
      try { 
        winston.info(`Reading rlsr metadata: ${RLSR_METADATA_FILE}`);
        let versionMetadata = readRlsrMetadata();
      } catch(err) {
        logErrorAndSetExitCode(`Error in reading rlsr.metadata.json file. See for more details.\n${err}`);
        return;
      }
      versionMetadata.newVersion = newVersion;

      winston.info('Executing configuration blocks.');
      config.forEach(executeConfigurationBlock);
      winston.info('rlsr finished execution. Exiting...');
    } else {
      logErrorAndSetExitCode('Configuration must export an array of functions to execute.');  
    }
  } else {
    logErrorAndSetExitCode('Configuration file must be defined.');
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