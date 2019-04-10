"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deprecate(msg) {
    var stack;
    var stackStr = '';
    var error = new Error();
    if (error.stack) {
        stack = error.stack.replace(/^\s+at\s+/gm, '').split('\n');
        stackStr = "\n    " + stack.slice(2, 7).join('\n    ');
    }
    // eslint-disable-next-line
    console.log("[mongodb-memory-server]: DEPRECATION MESSAGE: " + msg + " " + stackStr + "\n\n");
}
exports.deprecate = deprecate;
//# sourceMappingURL=deprecate.js.map