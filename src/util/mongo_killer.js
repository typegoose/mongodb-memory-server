/* eslint-disable */
/*
    make sure every few seconds that parent is still alive
    and if it is dead, we will kill child too.
    this is to ensure that exits done via kill
    wont leave mongod around
*/

var parentPid = parseInt(process.argv[2], 10);
var childPid = parseInt(process.argv[3], 10);

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
