const ErrorHandler = require('../util/ErrorHandler');

function executeBlock(versionMetadata, func, index) {
  if(typeof func === 'function') {
    func(versionMetadata);
  } else {
    ErrorHandler.logErrorAndSetExitCode(`Index ${index} of configuration file is not a function.`);
  }
}

class Configuration {
  constructor(executionBlocks) {
    this.executionBlocks = executionBlocks;
  }
  
  execute(versionMetadata) {
    this.executionBlocks.forEach(executeBlock.bind(null, versionMetadata));
  }

  isValid() {
    if(Array.isArray(this.executionBlocks) && this.executionBlocks.every((block) => { 
      return (typeof block === 'function');
    })) {
      return true;
    } else {
      ErrorHandler.logErrorAndSetExitCode('Configuration must export an array of functions to execute.');
      return false; 
    }
  }
}

module.exports = Configuration;