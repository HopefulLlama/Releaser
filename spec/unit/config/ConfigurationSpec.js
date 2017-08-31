const winston = require('winston');

const BASE = '../../../';

const Configuration = require(`${BASE}src/config/Configuration`);

function noOp() {}

describe('Configuration', () => {
  let testee;

  beforeEach(() => {
    testee = undefined;
  });

  it('should have release and pre-release defined', () => {
    let preRelease = [noOp];
    let release = [noOp];

    testee = new Configuration({
      preRelease,
      release
    });

    expect(testee.preRelease.functions).toBe(preRelease);
    expect(testee.release.functions).toBe(release);
  });

  it('should default to empty array', () => {
    testee = new Configuration({});

    expect(testee.preRelease.functions).toEqual([]);
    expect(testee.release.functions).toEqual([]);
  });

  describe('should not be valid', () => {
    beforeEach(() => {
      testee = new Configuration({});
    });

    it('when preRelease is invalid', () => {
      spyOn(testee.preRelease, 'isValid').and.returnValue(false);  

      expect(testee.isValid()).toBe(false);
    });

    it('when release is invalid', () => {
      spyOn(testee.release, 'isValid').and.returnValue(false);  

      expect(testee.isValid()).toBe(false);
    });

    it('when both preRelease and release is invalid', () => {
      spyOn(testee.release, 'isValid').and.returnValue(false);  

      expect(testee.isValid()).toBe(false);
    });
  });

  it('should be valid when both are valid', () => {
    let preRelease = [noOp];
    let release = [noOp];

    testee = new Configuration({
      preRelease,
      release
    });

    expect(testee.isValid()).toBe(true);
  });
});