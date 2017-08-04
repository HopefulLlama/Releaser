const winston = require('winston');

const BASE = '../../';

const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);
const ConfigurationReader = require(`${BASE}src/reader/ConfigurationReader`);
const MetadataReader = require(`${BASE}src/reader/MetadataReader`);
const llamaRlsr = require(`${BASE}src/llama-rlsr`);

const CONFIG_FILE = './swag';
const NEW_VERSION = '0.0.2';

const INPUTS = [CONFIG_FILE, NEW_VERSION];

const INVALID_CONFIG_OPTIONS = [1, 2, 3];
const VALID_CONFIG_OPTIONS = [() => {}, () => {}];

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
      let result = llamaRlsr(...testCase);

      expect(result).toBe(false, index);
      expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalledWith('Usage: llama-rlsr <config-file> <version>');
    });
  });

  describe('reading config', () => {
    afterEach(() => {
      expect(winston.info).toHaveBeenCalledWith(`Reading configuration file: ${CONFIG_FILE}`);
    });

    describe('which is invalid', () => {
      beforeEach(() => {
        spyOn(ConfigurationReader, 'read').and.callFake(() => {
          return INVALID_CONFIG_OPTIONS;
        });
      });

      it('should return false on invalid config', () => {
        let result = llamaRlsr(...INPUTS);

        expect(result).toBe(false);
      });
    });

    describe('which is valid, reading metadata', () => {
      beforeEach(() => {
        spyOn(ConfigurationReader, 'read').and.callFake(() => {
          return VALID_CONFIG_OPTIONS;
        });
      });

      afterEach(() => {
        expect(winston.info).toHaveBeenCalledWith('Reading llama-rlsr metadata');
      });

      describe('which is invalid', () => {
        beforeEach(() => {
          spyOn(MetadataReader, 'read').and.callFake(() => {
            return null;
          }); 
        });

        it('should return false on invalid metadata', () => {
          let result = llamaRlsr(...INPUTS);

          expect(result).toBe(false);
        });
      });

      describe('which is valid', () => {
        beforeEach(() => {
          spyOn(MetadataReader, 'read').and.callFake(() => {
            return {};
          }); 
        });

        it('should pass through', () => {
          let result = llamaRlsr(...INPUTS);

          expect(winston.info).toHaveBeenCalledWith('Executing configuration blocks.');
          expect(winston.info).toHaveBeenCalledWith('llama-rlsr finished execution. Exiting...');
          
          expect(result).toBe(true);          
        });      
      });
    });
  });
});