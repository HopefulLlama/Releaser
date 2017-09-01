const ErrorHandler = require('../util/ErrorHandler');

class FunctionArray {
  constructor(array) {
    this.functions = array;
  }

  execute(versionMetadata) {
    return new Promise((resolve, reject) => {

      let functions = this.functions;

      function done() {
        let func = functions.shift();
        if(func !== undefined) {
          func(versionMetadata, done);
        } else {
          resolve();
        }
      }

      done();
    });
  } 

  isValid() {
    return Array.isArray(this.functions) && this.functions.every((element) => {
      return (typeof element === 'function');
    });
  }
}

module.exports = FunctionArray;