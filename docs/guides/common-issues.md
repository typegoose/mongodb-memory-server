---
id: common-issues
title: 'Common Issues'
---

There are some common issues you may encounter with mongodb-memory-server (or also manually handling mongod instances), this guide will try to explain why they happen how to fix those issues.

## MongoWriteConcernError: operation was interrupted

The Error `MongoWriteConcernError: operation was interrupted` happens when a operation which is not retryable fails, which includes for example `db.dropDatabase`.
This Error happens because mongodb firstly starts all instances, says they are okay and has a primary (which are all events mongodb-memory-server listens for before resolving `.start`), but the shortly after the `.start` is resolved, the instace that is primary decides to step-down due to whatever reason.

The fix is to manually re-try those operations, like:

```js
// original:
async function setup(db) {
  await db.dropDatabase();
}

// fix
async function setup(db) {
  let retries = 5;
  while (retries > 0) {
    retries -= 1;
    try {
      await _setup(db);
    } catch (err) {
      if (err instanceof mongodb.MongoWriteConcernError && /operation was interrupted/.test(err.message)) {
        continue;
      }

      throw err;
    }
  }
}

async function _setup(db) {
  await db.dropDatabase();
}
```

See [Operations which are retry-able](https://www.mongodb.com/docs/manual/core/retryable-writes/#retryable-write-operations).
