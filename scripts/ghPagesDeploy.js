/* eslint-disable @typescript-eslint/no-var-requires */
const deployInfo = require('./getDeployInfo')();
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

/* Constants / Config */

/** keep ".git", ".github", "website" and "scripts" */
const keepRegex = /^(?:\.git|website|scripts|versions)/;
/** Regex to filter and get versions output from git ls-tree */
const versionsFilter = /^versions\/(\d+\.x|beta)\/?$/;
/** Which branch to deploy to */
const pagesBranch = 'gh-pages';
/** As who should the deploy commit be made as */
const commiterInfo = {
  name: 'github-pages-deploy',
  email: '<>',
};
/** Commit message to use, from commit will be automatically added */
const commitMessage = `Deploying to ${pagesBranch}`;

/**
 * This Script should not be run outside of a CI or a testing directory
 */

function main() {
  // ensure this script is not accidentally run
  if (process.env['CI'] !== 'true') {
    console.log(
      'No CI detected, refusing to run\n' +
        'Make sure you are running this script in a copy and set Environment Variable CI to true'
    );

    process.exit(1);
  }

  // ensure the gh-pages branch exists and is up-to-date
  execSync(`git fetch origin ${pagesBranch}:${pagesBranch}`, { stdio: 'inherit' });

  // setup commiter info
  execSync(`git config user.name "${commiterInfo.name}"`, { stdio: 'inherit' });
  execSync(`git config user.email "${commiterInfo.email}"`, { stdio: 'inherit' });

  console.log('\nInstall & Build of website\n');

  // make sure everything is correctly installed
  execSync('yarn --cwd ./website install', { stdio: 'inherit' });

  // build the website
  execSync('yarn --cwd ./website build', { stdio: 'inherit' });

  console.log('\nSwitching Branches\n');

  // ensure there is nothing blocking from changing branches
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git stash push', { stdio: 'inherit' });

  // works because "website" does not exist on the gh-pages branch
  execSync(`git checkout ${pagesBranch}`, { stdio: 'inherit' });

  console.log('\nRemoving & Moving build\n');

  // create deployAs directory, if not empty
  if (!!deployInfo.deployPath) {
    fs.mkdirSync(deployInfo.deployPath, { recursive: true });
  }

  // remove everything except from the "keep" regex
  const deployCleanDir = path.join('.', deployInfo.deployPath);
  for (const entry of fs.readdirSync(deployCleanDir)) {
    if (entry.match(keepRegex)) {
      continue;
    }

    const rmPath = path.join(deployCleanDir, entry);

    console.log('rm', rmPath); // always log what is removed
    fs.rmSync(rmPath, { recursive: true });
  }

  // move all files from "website/build" to "deployAs"
  const websiteDir = 'website/build';
  for (const entry of fs.readdirSync(websiteDir)) {
    if (entry.match(keepRegex)) {
      console.error('Website build contained entry from keep. Skipping! entry:', entry);
      continue;
    }

    const from = path.join(websiteDir, entry);
    const to = path.join(deployInfo.deployPath, entry);
    console.log('rename', from, '->', to); // always log what is renamed
    fs.renameSync(from, to);
  }

  // remove website
  fs.rmSync('website', { recursive: true });

  // generate versions.json file
  const versions = generateVersions();
  fs.writeFileSync('versions.json', JSON.stringify(versions));

  console.log('\nCommiting Changes\n');

  // add stage all changes
  execSync('git add -A', { stdio: 'inherit' });

  if (!hasChanges()) {
    console.log('No changes, exiting');

    return;
  }

  let commitmsg = commitMessage;
  const githubSHA = process.env['GITHUB_SHA'];

  if (githubSHA) {
    commitmsg += ` from @ ${githubSHA}`;
  }

  // commit the changes
  execSync(`git commit -m "${commitmsg}"`, { stdio: 'inherit' });

  // refuse to push changes when not being in a CI (even if CI=true) for local testing
  if (!githubSHA) {
    console.log(
      'Refusing to push changes, because not in a CI (missing evironment variable "GITHUB_SHA")'
    );
    process.exit(2);
  }

  console.log('\nPushing Changes\n');

  execSync(`git push --set-upstream origin ${pagesBranch}`, { stdio: 'inherit' });
}

main();

/**
 * Check if the current git repo has changes staged
 * @returns {boolean} `true` if there are changes staged, `false` otherwise
 */
function hasChanges() {
  try {
    // the following command exists with "0" if there are no changes, otherwise "1"
    execSync('git diff-index --quiet HEAD --');

    return false;
  } catch (err) {
    // check if the error is a childprocess error, which will always have a "status" property
    if (!!err.status) {
      return true;
    }

    throw err;
  }
}

/**
 * Generate the versions.json file
 * @returns Object with keys sorted so that "beta" is first and otherwise the highest number descending
 */
function generateVersions() {
  console.log('\nGenerating Versions\n');

  const versions_map = new Map();

  try {
    // get existing versions.json file to include version that to merge them
    const pagesVersions = execSync(`git show ${pagesBranch}:versions.json`).toString();

    const parsed = JSON.parse(pagesVersions);

    if (Array.isArray(parsed)) {
      throw new Error('versions.json is a array, expected object');
    }

    for (const [key, path] of Object.entries(parsed)) {
      versions_map.set(key, path);
    }
  } catch (err) {
    console.log('failed to get existing versions.json:', err);
  }

  // get all existing versions from the gh-pages branch and merge them with existing versions.json
  const versions_tree = execSync(`git ls-tree --name-only ${pagesBranch} versions/`);

  // parse all versions from the git output
  for (const line of versions_tree.toString().split('\n')) {
    const caps = versionsFilter.exec(line);

    if (caps) {
      versions_map.set(caps[1], line);
      continue;
    }

    // ignore a empty line (to log no warning)
    if (line.length === 0) {
      continue;
    }

    console.log('no match found for version line:', line);
  }

  // always add the current version
  versions_map.set(deployInfo.deployName, deployInfo.deployPath);

  // sort the versions so that named branches are at specific places and numbers are highest descending
  const versions = Array.from(versions_map.entries()).sort(([versionA], [versionB]) => {
    if (versionA === 'beta' && versionB === 'beta') {
      return 0;
    }
    if (versionA === 'beta') {
      return -1;
    }
    if (versionB === 'beta') {
      return 1;
    }

    const parsedA = parseInt(versionA.split('.')[0]);
    const parsedB = parseInt(versionB.split('.')[0]);

    return parsedB - parsedA;
  });

  return Object.fromEntries(versions);
}
