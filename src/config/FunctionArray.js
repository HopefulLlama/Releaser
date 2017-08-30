const ErrorHandler = require('../util/ErrorHandler');

function isFunctionArray(testee) {
  return Array.isArray(testee) && testee.every((element) => {
    return (typeof element === 'function');
  });
}

class FunctionArray {
  constructor(array) {
    if(isFunctionArray(array)) {
      this.functions = array;
    } else {
      ErrorHandler.logErrorAndSetExitCode(`Expected an array of functions, instead got: ${array}`);
    }
  }

  execute(versionMetadata) {
    let functions = this.functions;

    function done() {
      let func = functions.shift();
      if(func !== undefined) {
        func(versionMetadata, done);
      }
    }

    done();
  } 
}

module.exports = FunctionArray;