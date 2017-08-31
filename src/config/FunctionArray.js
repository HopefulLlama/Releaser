const ErrorHandler = require('../util/ErrorHandler');

class FunctionArray {
  constructor(array) {
    this.functions = array;
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

  isValid() {
    return Array.isArray(this.functions) && this.functions.every((element) => {
      return (typeof element === 'function');
    });
  }
}

module.exports = FunctionArray;