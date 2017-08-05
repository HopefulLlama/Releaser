const fs = require('fs');
const os = require('os');

const ErrorHandler = require('../util/ErrorHandler');

const LLAMA_RLSR_METADATA_FILE = 'llama-rlsr.metadata.json';

function read(newVersion) {
  try { 
    let metadata = JSON.parse(fs.readFileSync(LLAMA_RLSR_METADATA_FILE, 'utf8'));
    metadata.newVersion = newVersion;
    return metadata;
  } catch(err) {
    ErrorHandler.logErrorAndSetExitCode(`Error in reading ${LLAMA_RLSR_METADATA_FILE} file. See for more details.${os.EOL}${err}`);
    return null;
  }
}

function write(newVersion) {
	let metadata = {oldVersion: newVersion};
	try {
		fs.writeFileSync(LLAMA_RLSR_METADATA_FILE, JSON.stringify(metadata));
		return true;
	} catch(err) {
    ErrorHandler.logErrorAndSetExitCode(`Error in writing ${LLAMA_RLSR_METADATA_FILE} file. See for more details.${os.EOL}${err}`);
    return false;
	}
}

module.exports = {
  read,
  write
};