const winston = require('winston');

const BASE = '../../';

const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);
const ConfigurationReader = require(`${BASE}src/reader/ConfigurationReader`);
const MetadataHandler = require(`${BASE}src/reader/MetadataHandler`);
const llamaRlsr = require(`${BASE}src/llama-rlsr`);

const CONFIG_FILE = './swag';
const NEW_VERSION = '0.0.2';

const INPUTS = [CONFIG_FILE, NEW_VERSION];

const INVALID_CONFIG_OPTIONS = [1, 2, 3];
const MOCK_FUNCTION = (versionMetadata, done) => {
  done();
};
const VALID_CONFIG_OPTIONS = [MOCK_FUNCTION, MOCK_FUNCTION];

describe('llama-rlsr', () => {
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
      expect(llamaRlsr(...testCase)).toBe(false, index);
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
        expect(llamaRlsr(...INPUTS)).toBe(false);
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
          expect(llamaRlsr(...INPUTS)).toBe(false);
        });
      });

      describe('which is valid', () => {
        beforeEach(() => {
          spyOn(MetadataHandler, 'read').and.callFake(() => {
            return {};
          }); 
        });

        afterEach(() => {
          [
            'Executing configuration blocks.',
            'llama-rlsr finished execution.',
            'Updating llama-rlsr metadata.'
          ].forEach((message) => {
            expect(winston.info).toHaveBeenCalledWith(message);
          });
        });

        describe('with succesful metadata write', () => {
          beforeEach(() => {
            spyOn(MetadataHandler, 'write').and.callFake(() => {
              return true;
            });
          });

          it('should pass through', () => {
            expect(llamaRlsr(...INPUTS)).toBe(true);
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
            expect(llamaRlsr(...INPUTS)).toBe(false);
            expect(MetadataHandler.write).toHaveBeenCalledWith(NEW_VERSION);
          });
        });
      });
    });
  });
});