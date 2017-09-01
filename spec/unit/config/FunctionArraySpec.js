const winston = require('winston');

const BASE = '../../../';

const FunctionArray = require(`${BASE}src/config/FunctionArray`);
const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);

const MOCK_FUNCTION = (versionMetadata, done) => {
  done();
};

describe('FunctionArray', () => {
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
  ].forEach((invalid) => {
    it(`${typeof invalid} should be invalid`, () => {
      testee = new FunctionArray(invalid);
      expect(testee.isValid()).toBe(false);
    });
  });

  it('should be valid', () => {
    testee = new FunctionArray([MOCK_FUNCTION, MOCK_FUNCTION]);
    expect(testee.isValid()).toBe(true);
    expect(ErrorHandler.logErrorAndSetExitCode).not.toHaveBeenCalled();
  });

  it('should execute functions', () => {
    let funcOne = jasmine.createSpy('funcOne').and.callFake(MOCK_FUNCTION);
    let funcTwo = jasmine.createSpy('funcTwo').and.callFake(MOCK_FUNCTION);

    testee = new FunctionArray([funcOne, funcTwo]);

    let metadataVersion = {};
    testee.execute(metadataVersion);

    expect(funcOne).toHaveBeenCalledWith(metadataVersion, jasmine.any(Function));
    expect(funcTwo).toHaveBeenCalledWith(metadataVersion, jasmine.any(Function));
  });

  it('should execute functions in order', (testDone) => {
    let winstonCalls = [
      'start',
      'funcOne',
      'funcTwo',
      'end'
    ];

    let funcOne = (metadataVersion, done) => {
      setTimeout(() => {
        winston.info(winstonCalls[1]);
        done();
      }, 1000);
    };
    let funcTwo = (metadataVersion, done) => {
      winston.info(winstonCalls[2]);
      done();
    };

    testee = new FunctionArray([funcOne, funcTwo]);

    winston.info(winstonCalls[0]);
    testee.execute({})
    .then(() => {
      winston.info(winstonCalls[3]);

      winstonCalls.forEach((content, index) => {
        expect(winston.info.calls.argsFor(index)).toEqual([content]);
      }); 

      testDone();
    });
  });
});