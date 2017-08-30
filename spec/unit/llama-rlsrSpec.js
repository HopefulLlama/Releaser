const llamaRlsr = require('../../src/llama-rlsr');
const Runner = require('../../src/runner/Runner');

describe('llama-rlsr', () => {
  it('should export Runner.run', () => {
    expect(llamaRlsr).toBe(Runner.run);
  });
});