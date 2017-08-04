const winston = require('winston');

const ErrorHandler = require('../../../src/util/ErrorHandler');

describe('ErrorHandler', () => {
  beforeEach(() => {
    spyOn(winston, 'error').and.stub();
  });

  it('should log an error', () => {
    ErrorHandler.logErrorAndSetExitCode('Hello');

    expect(winston.error).toHaveBeenCalledWith('Hello');
    if(process.exitCode === 1) {
    	process.exitCode = 0;
    } else {
    	fail();
    }
  });
});