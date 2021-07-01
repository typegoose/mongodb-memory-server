---
id: integration-examples
title: 'Integration Examples'
---

This Guide will show how `mongodb-memory-server` can be used with different frameworks

## jest

For useage with `jest` it is recommended to use the [`globalSetup`](https://jestjs.io/docs/en/configuration#globalsetup-string) and [`globalTeardown`](https://jestjs.io/docs/en/configuration#globalteardown-string) options

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
  await mongoose.connect(`${process.env.MONGO_URI}/${config.DataBase}`, { useNewUrlParser: true, useUnifiedTopology: true });
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
import { connect, disconnect } from './utils/connect';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});
```

## mocha / chai

Start Mocha with `--timeout 60000` cause first download of MongoDB binaries may take a time.

```js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

before(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
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
