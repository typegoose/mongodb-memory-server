/*
  Make sure every few seconds that `parent` and `child` are alive:
  - if `parent` is dead:
    - kill child
    - kill itself
  - if `child` is dead:
    - kill itself
*/

const parentPid = parseInt(process.argv[2], 10);
const childPid = parseInt(process.argv[3], 10);

if (parentPid && childPid) {
  setInterval(() => {
    // if parent dead
    try {
      process.kill(parentPid, 0);
    } catch (e) {
      try {
        process.kill(childPid);
      } catch (ee) {
        // doesnt matter if it is dead
      }
      process.exit();
    }

    // if child dead
    try {
      process.kill(childPid, 0);
    } catch (e) {
      process.exit();
    }
  }, 2000);
}
