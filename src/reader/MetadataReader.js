const fs = require('fs');
const os = require('os');

const ErrorHandler = require('../util/ErrorHandler');

const RLSR_METADATA_FILE = 'rlsr.metadata.json';

function read(newVersion) {
  try { 
    let metadata = JSON.parse(fs.readFileSync(RLSR_METADATA_FILE, 'utf8'));
    metadata.newVersion = newVersion;
    return metadata;
  } catch(err) {
    ErrorHandler.logErrorAndSetExitCode(`Error in reading ${RLSR_METADATA_FILE} file. See for more details.${os.EOL}${err}`);
    return null;
  }
}

module.exports = {
  read
};