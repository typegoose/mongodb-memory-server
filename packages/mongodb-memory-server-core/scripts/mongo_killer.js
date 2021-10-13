/*
  Make sure every few seconds that `parent` and `child` are alive:
  - if `parent` is dead:
    - kill child
    - kill itself
  - if `child` is dead:
    - kill itself
*/

/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param {any} val Any value to test if null or undefined
 */
function isNullOrUndefined(val) {
  return val === null || val === undefined;
}

/**
 * Check if the given Process is still alive
 * @param {number} pid The Process PID
 */
function isAlive(pid) {
  try {
    process.kill(pid, 0);

    return true;
  } catch (err) {
    return false;
  }
}

// the following line is just to ensure this process gets actually exited
process.on('SIGINT', () => process.exit(0));

const parentPid = parseInt(process.argv[2], 10);
const childPid = parseInt(process.argv[3], 10);

function check() {
  // if parent dead
  if (!isAlive(parentPid)) {
    console.log('mongo_killer: parentPid not alive');
    try {
      process.kill(childPid);
    } catch (err) {
      console.log('mongo_killer: couldnt kill child:', err);
    }
    process.exit();
  }

  // if child dead
  if (!isAlive(childPid)) {
    console.log('mongo_killer: childPid not alive');
    process.exit();
  }
}

if (isNullOrUndefined(parentPid) || Number.isNaN(parentPid)) {
  console.log('mongo_killer: parentPid is undefined or NaN!');
  process.exit(-1);
}

if (isNullOrUndefined(childPid) || Number.isNaN(childPid)) {
  console.log('mongo_killer: childPid is undefined or NaN!');
  process.exit(-1);
}

check(); // run once before the interval
setInterval(check, 2000);
