export function deprecate(msg: string): void {
  let stack;
  let stackStr = '';
  const error = new Error();

  if (error.stack) {
    stack = error.stack.replace(/^\s+at\s+/gm, '').split('\n');
    stackStr = `\n    ${stack.slice(2, 7).join('\n    ')}`;
  }

  // eslint-disable-next-line no-console
  console.log(`[mongodb-memory-server]: DEPRECATION MESSAGE: ${msg} ${stackStr}\n\n`);
}
