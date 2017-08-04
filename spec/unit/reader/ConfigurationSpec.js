const winston = require('winston');

const BASE = '../../../';

const Configuration = require(`${BASE}src/reader/Configuration`);
const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);

describe('Configuration', () => {
  let testee;

  beforeEach(() => {
  	testee = undefined;

    spyOn(ErrorHandler, 'logErrorAndSetExitCode').and.stub();
    spyOn(winston, 'info').and.stub();
  });

  [
    'sdfa',
    324,
    false,
    true,
    null, 
    undefined,
    {},
    ['dsfs', 'fff'],
    [1, 2],
    [false, true],
    [null, undefined],
    [() => {}, true]
  ].forEach((invalidBlock) => {
    it(`${typeof invalidBlock} should be invalid`, () => {
      testee = new Configuration(invalidBlock);

      expect(testee.isValid()).toBe(false);
      expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith('Configuration must export an array of functions to execute.');
    });
  });

  it('should be valid', () => {
    testee = new Configuration([() => {}, () => {}]);

    expect(testee.isValid()).toBe(true);
    expect(ErrorHandler.logErrorAndSetExitCode).not.toHaveBeenCalled();
  });

  it('should both log errors', () => {
    testee = new Configuration(['123', 123]);

    testee.execute({});

    expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith('Index 0 of configuration file is not a function.');
    expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith('Index 1 of configuration file is not a function.');
  });

  it('should execute functions', () => {
    let funcOne = jasmine.createSpy('funcOne');
    let funcTwo = jasmine.createSpy('funcTwo');

    testee = new Configuration([funcOne, funcTwo]);

    let metadataVersion = {};
    testee.execute(metadataVersion);

    expect(funcOne).toHaveBeenCalledWith(metadataVersion);
    expect(funcTwo).toHaveBeenCalledWith(metadataVersion);
  });
});