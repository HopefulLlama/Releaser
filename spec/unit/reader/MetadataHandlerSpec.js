const fs = require('fs');
const os = require('os');

const BASE = '../../../';

const MetadataHandler = require(`${BASE}src/reader/MetadataHandler`);
const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);

const LLAMA_RLSR_METADATA_FILE = 'llama-rlsr.metadata.json';

describe('MetadataHandler', () => {
  let testee;

  beforeEach(() => {
    testee = undefined;
    spyOn(ErrorHandler, 'logErrorAndSetExitCode').and.stub();
  });

  describe('read', () => {
    afterEach(() => {
      expect(fs.readFileSync).toHaveBeenCalledWith('llama-rlsr.metadata.json', 'utf8');
    });

    describe('when file is not available', () => {
      beforeEach(() => {
        spyOn(fs, 'readFileSync').and.throwError('llama');
      });

      it('should error', () => {
        testee = MetadataHandler.read('0.0.1');

        expect(testee).toBe(null);
        expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalled();
      });
    });

    describe('when file is available', () => {
      beforeEach(() => {
        spyOn(fs, 'readFileSync').and.callFake(() => {
          return JSON.stringify({
            oldVersion: '0.0.1', 
            genericData: true
          });
        });
      });
      it('should read metadata and append newVersion', () => {
        testee = MetadataHandler.read('0.0.2');

        expect(testee).toEqual({
          oldVersion: '0.0.1',
          genericData: true,
          newVersion: '0.0.2'
        });
        expect(ErrorHandler.logErrorAndSetExitCode).not.toHaveBeenCalled();
      });
    });
  });

  describe('write', () => {
    it('should write metadata', () => {
      spyOn(fs, 'writeFileSync').and.stub();
      let result = MetadataHandler.write('0.0.2');

      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalledWith(LLAMA_RLSR_METADATA_FILE, '{"oldVersion":"0.0.2"}');
    });

    it('should log when error on write', () => {
      spyOn(fs, 'writeFileSync').and.throwError('llama');

      let result = MetadataHandler.write('0.0.2');

      expect(result).toBe(false);
      expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalled();
    });
  });
});