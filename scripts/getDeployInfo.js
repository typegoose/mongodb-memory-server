/*
 * Script to get deployment information
 */

module.exports = function getDeployInfo() {
  /** Branch we are currently on and will be used for edit branch */
  let branch = 'master';
  /** Name of the deploy */
  let deployName = '';
  let packagejson = require('../packages/mongodb-memory-server-core/package.json');

  function checkDeploy() {
    if (process.env['CI'] === 'true' && process.env['GITHUB_REF_NAME']) {
      const refName = process.env['GITHUB_REF_NAME'];

      const oldBranchMatches = /^old\/(\d+\.x)/.exec(refName);

      if (oldBranchMatches) {
        branch = 'old/' + oldBranchMatches[1];
        deployName = oldBranchMatches[1];

        return;
      }

      if (refName === 'beta') {
        branch = deployName = 'beta';

        return;
      }
    }
  }

  checkDeploy();

  return {
    branch,
    // change deploy name to be the deploy path in version directory
    deployPath: deployName ? `versions/${deployName}` : '',
    // deploy name should always be defined, if not set via the above, use the package.json major version
    deployName: deployName ? deployName : packagejson.version.split('.')[0] + '.x',
    searchName: deployName.length === 0 ? 'current' : deployName,
  };
};
