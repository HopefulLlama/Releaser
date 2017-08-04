const os = require('os');

const BASE = '../../../';

const ConfigurationReader = require(`${BASE}src/reader/ConfigurationReader`);
const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);

describe('ConfigurationReader', () => {
  let testee;

  beforeEach(() => {
  	testee = undefined;
  	spyOn(ErrorHandler, 'logErrorAndSetExitCode').and.stub();
  });

  it('should error', () => {
  	testee = ConfigurationReader.read('./swag');

  	expect(testee).toBe(null);
  	expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith(`Error in executing configuration file. ` +
  		`See for more details.${os.EOL}` + 
  		'Error: Cannot find module \'./swag\'');
  });

  // Missing good path test
});