const ErrorHandler = require('../util/ErrorHandler');

function executeBlock(versionMetadata, func, done, index) {
  if(typeof func === 'function') {
    func(versionMetadata, done);
  } else {
    ErrorHandler.logErrorAndSetExitCode(`Index ${index} of configuration file is not a function.`);
    done();
  }
}

class Configuration {
  constructor(executionBlocks) {
    this.executionBlocks = executionBlocks;
  }
  
  execute(versionMetadata) {
    let index = 0;
    let executionBlocks = this.executionBlocks;

    function done() {
      let block = executionBlocks.shift();
      if(block !== undefined) {
        executeBlock(versionMetadata, block, done, index++);
      }
    }

    done();
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