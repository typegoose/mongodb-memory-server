---
id: test-runners
title: 'Integration with Test Runners'
---

This Guide will show how `mongodb-memory-server` can be used with different frameworks

## jest

<span class="badge badge--secondary">jest version 29</span>

For usage with `jest` it is recommended to use the [`globalSetup`](https://jestjs.io/docs/en/configuration#globalsetup-string) and [`globalTeardown`](https://jestjs.io/docs/en/configuration#globalteardown-string) options

`config.ts`:

```ts
// this file could be anything (like a json directly imported)

export = {
  Memory: true,
  IP: '127.0.0.1',
  Port: '27017',
  Database: 'somedb'
}
```

`jest.config.json`:

```ts
{
  "preset": "ts-jest",
  "globalSetup": "<rootDir>/test/globalSetup.ts",
  "globalTeardown": "<rootDir>/test/globalTeardown.ts",
  "setupFilesAfterEnv": [
    "<rootDir>/test/setupFile.ts"
  ]
}

```

`globalSetup.ts`:

```ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { config } from './utils/config';

export = async function globalSetup() {
  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = `mongodb://${config.IP}:${config.Port}`;
  }

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(`${process.env.MONGO_URI}/${config.Database}`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};

```

`globalTeardown.ts`:

```ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './utils/config';

export = async function globalTeardown() {
  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    await instance.stop();
  }
};
```

and an [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array) can be used to connect something like `mongoose` or `mongodb`

`setupFile.ts`:

```ts
beforeAll(async () => {
  // put your client connection code here, example with mongoose:
  await mongoose.connect(process.env['MONGO_URI']);
});

afterAll(async () => {
  // put your client disconnection code here, example with mongodb:
  await mongoose.disconnect();
});
```

:::caution
It is very important to limit the spawned number of Jest workers on machines that have many cores, because otherwise the tests may run slower than with fewer workers, because the database instance(s) may be hit very hard.  
Use either [`--maxWorkers 4`](https://jestjs.io/docs/configuration#maxworkers-number--string) or [`--runInBand`](https://jestjs.io/docs/cli#--runinband) to limit the workers.
:::

:::note
Keep in mind that jest's global-setup and global-teardown do **not** share a environment with the tests themself, and so require `setupFile` / `setupFilesAfterEnv` to actually connect.
:::

## mocha / chai

<span class="badge badge--secondary">mocha version (unknown)</span>

Start Mocha with `--timeout 60000` cause first download of MongoDB binaries may take a time.

```js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, opts);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('...', () => {
  it('...', async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String }));
    const cnt = await User.count();
    expect(cnt).to.equal(0);
  });
});
```

## AVA test runner

For AVA written [detailed tutorial](https://github.com/zellwk/ava/blob/8b7ccba1d80258b272ae7cae6ba4967cd1c13030/docs/recipes/endpoint-testing-with-mongoose.md) how to test mongoose models by @zellwk.

:::note
Note that this mentioned tutorial is pre 7.x
:::
