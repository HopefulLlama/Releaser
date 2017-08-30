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

const INVALID_CONFIG_OPTIONS = [1, 2, 3];
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

  it('should fail validation', () => {
    [
      [CONFIG_FILE, undefined],
      [undefined, NEW_VERSION],
      [undefined, undefined],
    ].forEach((testCase, index) => {
      expect(Runner.run(...testCase)).toBe(false, index);
      expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith('Usage: llama-rlsr <config-file> <version>');
    });
  });

  describe('reading config', () => {
    afterEach(() => {
      expect(winston.info).toHaveBeenCalled();
    });

    describe('which is invalid', () => {
      beforeEach(() => {
        spyOn(ConfigurationReader, 'read').and.callFake(() => {
          return INVALID_CONFIG_OPTIONS;
        });
      });

      it('should return false on invalid config', () => {
        expect(Runner.run(...INPUTS)).toBe(false);
      });
    });

    describe('which is valid, reading metadata', () => {
      beforeEach(() => {
        spyOn(ConfigurationReader, 'read').and.callFake(() => {
          return VALID_CONFIG_OPTIONS;
        });
      });

      afterEach(() => {
        expect(winston.info).toHaveBeenCalledWith('Reading llama-rlsr metadata.');
      });

      describe('which is invalid', () => {
        beforeEach(() => {
          spyOn(MetadataHandler, 'read').and.callFake(() => {
            return null;
          }); 
        });

        it('should return false on invalid metadata', () => {
          expect(Runner.run(...INPUTS)).toBe(false);
        });
      });

      describe('which is valid', () => {
        beforeEach(() => {
          spyOn(MetadataHandler, 'read').and.callFake(() => {
            return METADATA;
          }); 
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
            spyOn(MetadataHandler, 'write').and.callFake(() => {
              return true;
            });
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

          it('should pass through', () => {
            expect(Runner.run(...INPUTS)).toBe(true);
            expect(MetadataHandler.write).toHaveBeenCalledWith(NEW_VERSION);
          });
        });

        describe('with failing metadata write', () => {
          beforeEach(() => {
            spyOn(MetadataHandler, 'write').and.callFake(() => {
              return false;
            });
          });

          it('should fail overall', () => {
            expect(Runner.run(...INPUTS)).toBe(false);
            expect(MetadataHandler.write).toHaveBeenCalledWith(NEW_VERSION);
          });
        });
      });
    });
  });
});