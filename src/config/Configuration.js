const ErrorHandler = require('../util/ErrorHandler');
const FunctionArray = require('./FunctionArray');

class Configuration {
  constructor(importedConfiguration) {
    let preRelease = (importedConfiguration.preRelease !== undefined) ? importedConfiguration.preRelease : [];
    let release = (importedConfiguration.release !== undefined) ? importedConfiguration.release : [];

    this.preRelease = new FunctionArray(preRelease);
    this.release = new FunctionArray(release);
  }

  isValid() {
    return this.preRelease.isValid() && this.release.isValid();
  }
}

module.exports = Configuration;