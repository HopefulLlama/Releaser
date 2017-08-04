const fs = require('fs');
const os = require('os');

const BASE = '../../../';

const MetadataReader = require(`${BASE}src/reader/MetadataReader`);
const ErrorHandler = require(`${BASE}src/util/ErrorHandler`);

const LLAMA_RLSR_METADATA_FILE = 'llama-rlsr.metadata.json';

describe('MetadataReader', () => {
  let testee;

  beforeEach(() => {
    testee = undefined;
    spyOn(ErrorHandler, 'logErrorAndSetExitCode').and.stub();
  });

  it('should error', () => {
    testee = MetadataReader.read('0.0.1');

    expect(testee).toBe(null);
    expect(ErrorHandler.logErrorAndSetExitCode).toHaveBeenCalled();
  });

  it('should read metadata and append newVersion', () => {
    let metadata = {
      oldVersion: '0.0.1',
      genericData: true
    };

    fs.writeFileSync(LLAMA_RLSR_METADATA_FILE, JSON.stringify(metadata));

    testee = MetadataReader.read('0.0.2');

    expect(testee).toEqual({
      oldVersion: '0.0.1',
      genericData: true,
      newVersion: '0.0.2'
    });
    expect(ErrorHandler.logErrorAndSetExitCode).not.toHaveBeenCalled();

    fs.unlinkSync(LLAMA_RLSR_METADATA_FILE);
  });
});