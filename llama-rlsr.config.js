const LlamaRlsrKeepAChangelog = require('llama-rlsr-keep-a-changelog');
const LlamaRlsrNpm = require('llama-rlsr-npm');
const simpleGit = require('simple-git')(process.cwd());

module.exports = {
  preRelease: [
    LlamaRlsrNpm.updateVersion(),
    LlamaRlsrKeepAChangelog.updateChangelog({
      placeholder: '- Nothing yet'
    }),
    LlamaRlsrKeepAChangelog.updateDiff({
      urlGenerator: (oldVersion, newVersion) => {
        return `https://github.com/HopefulLlama/llama-rlsr/compare/${oldVersion}...${newVersion}`;
      },
      latest: 'HEAD',
      tag: {
        prefix: 'v'
      }
    })
  ],
  release: [(versionMetadata, done) => {
    simpleGit.add(['package.json', 'CHANGELOG.md'], () => {
      simpleGit.commit(`Update to version ${versionMetadata.newVersion}`, () => {
        simpleGit.addTag(`v${versionMetadata.newVersion}`, () => {
          simpleGit.push('origin', 'master', () => {
            simpleGit.pushTags('origin', () => {
              done();
            });
          });
        });
      });
    });
  }]
};