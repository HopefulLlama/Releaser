const path = require('path');

const winston = require('winston');

const BASE = '../../../';

const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);
const ConfigurationReader = require(`${BASE}src/reader/ConfigurationReader`);
const MetadataHandler = require(`${BASE}src/reader/MetadataHandler`);
const Runner = require(`${BASE}src/runner/Runner`);

const CONFIG_FILE = './swag';
const NEW_VERSION = '0.0.2';

const METADATA = {
  oldVersion: '0.0.1',
  newVersion: NEW_VERSION
};

const INPUTS = [CONFIG_FILE, NEW_VERSION];

const INVALID_CONFIG_OPTIONS = {
  preRelease: [1, 2, 3]
};
const MOCK_FUNCTION = (versionMetadata, done) => {
  done();
};

const SPY_ONE = jasmine.createSpy('spyOne').and.callFake(MOCK_FUNCTION);
const SPY_TWO = jasmine.createSpy('spyTwo').and.callFake(MOCK_FUNCTION);
const SPY_THREE = jasmine.createSpy('spyThree').and.callFake(MOCK_FUNCTION);

const VALID_CONFIG_OPTIONS = {
  preRelease: [SPY_ONE, SPY_TWO],
  release: [SPY_THREE]
};

function assertPass(parameters, callback, asyncDone) {
  Runner.run(...parameters)
  .then(() => {
    callback();
    asyncDone();
  }).catch(fail);
}

function assertFail(parameters, callback, asyncDone) {
  Runner.run(...parameters)
  .then(fail).catch(() => {
    callback();
    asyncDone();
  });
}

function noOp () {}

describe('Runner', () => {
  beforeEach(() => {
    [
      {object: winston, method: 'info'},
      {object: ErrorHandler, method: 'logErrorAndSetExitCode'}
    ].forEach((mock) => {
      spyOn(mock.object, mock.method).and.stub();
    });

    config = jasmine.createSpyObj('config', ['isValid', 'execute']);
  });

  [
    [CONFIG_FILE, undefined],
    [undefined, NEW_VERSION],
    [undefined, undefined],
  ].forEach((testCase) => {
    it(`should fail validation: ${testCase}`, (testDone) => {
      assertFail(testCase, () => {
        expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith('Usage: llama-rlsr <config-file> <version>');
      }, testDone);    
    });
  });

  describe('reading config', () => {
    afterEach(() => {
      expect(winston.info).toHaveBeenCalledWith(`Reading configuration file: ${path.resolve(process.cwd(), CONFIG_FILE)}`);
    });

    describe('which is invalid', () => {
      beforeEach(() => {
        spyOn(ConfigurationReader, 'read').and.returnValue(INVALID_CONFIG_OPTIONS);
      });

      it('should return false', (testDone) => {
        assertFail(INPUTS, noOp, testDone);
      });
    });

    describe('which is valid, reading metadata', () => {
      beforeEach(() => {
        spyOn(ConfigurationReader, 'read').and.returnValue(VALID_CONFIG_OPTIONS);
      });

      afterEach(() => {
        expect(winston.info).toHaveBeenCalledWith('Reading llama-rlsr metadata.');
      });

      describe('which is invalid', () => {
        beforeEach(() => {
          spyOn(MetadataHandler, 'read').and.returnValue(null); 
        });

        it('should return false on invalid metadata', (testDone) => {
          assertFail(INPUTS, noOp, testDone);
        });
      });

      describe('which is valid', () => {
        beforeEach(() => {
          spyOn(MetadataHandler, 'read').and.returnValue(METADATA); 
        });

        afterEach(() => {
          [
            'Executing pre-release steps.',
            'Pre-release steps finished execution.',
            'Updating llama-rlsr metadata.'
          ].forEach((message) => {
            expect(winston.info).toHaveBeenCalledWith(message);
          });

          expect(SPY_ONE).toHaveBeenCalledWith(METADATA, jasmine.any(Function));
          expect(SPY_TWO).toHaveBeenCalledWith(METADATA, jasmine.any(Function));
        });

        describe('with succesful metadata write', () => {
          beforeEach(() => {
            spyOn(MetadataHandler, 'write').and.returnValue(true);
          });

          afterEach(() => {
            [
              'Executing release steps.',
              'Release steps finished execution.',
              'llama-rlsr finished execution.'
            ].forEach((message) => {
              expect(winston.info).toHaveBeenCalledWith(message);
            });

            expect(SPY_THREE).toHaveBeenCalledWith(METADATA, jasmine.any(Function));
          });

          it('should pass through', (testDone) => {
            assertPass(INPUTS, () => {
              expect(MetadataHandler.write).toHaveBeenCalledWith(NEW_VERSION);
            }, testDone);
          });

          it('should execute things in order', (testDone) => {
            let executedOrder = [];
            let expectedOrder = [
              'preReleaseOne',
              'preReleaseTwo',
              'releaseOne'
            ];

            VALID_CONFIG_OPTIONS.preRelease = [
              (metadataVersion, done) => {
                setTimeout(() => {
                  executedOrder.push('preReleaseOne');
                  done();
                }, 1000);
              },
              (metadataVersion, done) => {
                executedOrder.push('preReleaseTwo');
                done();
              }
            ];

            VALID_CONFIG_OPTIONS.release = [
              (metadataVersion, done) => {
                executedOrder.push('releaseOne');
                done();
              }
            ];

            assertPass(INPUTS, () => {
              expectedOrder.forEach((content, index) => {
                expect(content).toEqual(executedOrder[index]);
              });
            }, testDone);
          });
        });

        describe('with failing metadata write', () => {
          beforeEach(() => {
            spyOn(MetadataHandler, 'write').and.returnValue(false);
          });

          it('should fail overall', (testDone) => {
            assertFail(INPUTS, () => {
              expect(MetadataHandler.write).toHaveBeenCalledWith(NEW_VERSION);
            }, testDone);
          });
        });
      });
    });
  });
});