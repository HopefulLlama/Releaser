const Runner = require('./runner/Runner');

if (require.main === module) {
  // Usage: llama-rlsr external/config.js 2.2.0
  let pathToConfig = process.argv[2];
  let newVersion = process.argv[3];
  Runner.run(pathToConfig, newVersion);
} else {
  module.exports = Runner.run;
}