const winston = require('winston');

const BASE = '../../../';

const Configuration = require(`${BASE}src/config/Configuration`);

function noOp() {}

describe('Configuration', () => {
  it('should have release and pre-release defined', () => {
    let preRelease = [noOp];
    let release = [noOp];

    let config = new Configuration({
      preRelease,
      release
    });

    expect(config.preRelease.functions).toBe(preRelease);
    expect(config.release.functions).toBe(release);
  });

  it('should default to empty array', () => {
    let config = new Configuration({});

    expect(config.preRelease.functions).toEqual([]);
    expect(config.release.functions).toEqual([]);
  });
});