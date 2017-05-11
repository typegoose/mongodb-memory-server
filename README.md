# mongodb-memory-server

[![NPM version](https://img.shields.io/npm/v/mongodb-memory-server.svg)](https://www.npmjs.com/package/mongodb-memory-server)
[![Downloads stat](https://img.shields.io/npm/dt/mongodb-memory-server.svg)](http://www.npmtrends.com/mongodb-memory-server)
[![Travis](https://img.shields.io/travis/nodkz/mongodb-memory-server.svg?maxAge=2592000)](https://travis-ci.org/nodkz/mongodb-memory-server)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This package spins up a actual/real MongoDB Server programmatically from node for testing or mocking during development. By default it holds the data in memory. Fresh spinned up `mongod` process takes about 7Mb of memory. The server will allow you to connect your favorite ODM or client library to the MongoDB Server and run integration tests isolated from each other. You can start up several mongod simultaneously, it automatically discovers free ports.

This package use [mongodb-prebuilt](https://github.com/winfinit/mongodb-prebuilt) which on first start downloads the latest MongoDB binaries and save it to `~/.mongodb-prebuilt` folder. So first run may take a time. All further runs will use downloaded version.

## Installation
```
yarn add mongodb-memory-server --dev
OR
npm install mongodb-memory-server --save-dev
```

## Usage

### Simple server start:
```js
import MongodbMemoryServer from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

const uri = await mongod.getConnectionString();
const port = await mongod.getPort();
const dbPath = await mongod.getDbPath();

mongod.stop();
```

### Provide connection string to mongoose
```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getConnectionString().then((mongoUri) => {
  const mongooseOpts = {
    server: {
      auto_reconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    },
  };

  mongoose.connect(mongoUri, mongooseOpts);

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});
```
For additional information I recommend you to read this article [Testing a GraphQL Server using Jest with Mongoose](https://medium.com/entria/testing-a-graphql-server-using-jest-4e00d0e4980e)


### Several mongoose connections simultaneously
```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

mongoose.Promise = Promise;

const mongoServer1 = new MongoMemoryServer();
const mongoServer2 = new MongoMemoryServer();

const mongooseOpts = {
  server: {
    promiseLibrary = Promise;
    auto_reconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  },
};

function addEvents(connection, mongoUri) {
  connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
}

// Firstly create connection objects, which you may import in other files and create mongoose models.
// Connection to databases will be estimated later (after model creation).
const connections = {
  conn1: mongoose.createConnection(),
  conn2: mongoose.createConnection(),
  conn3: mongoose.createConnection(),
};

mongoServer1.getConnectionString('server1_db1').then((mongoUri) => {
  connections.conn1.connect(mongoUri, mongooseOpts);
  addEvents(connections.conn1, mongoUri);
});

mongoServer1.getConnectionString('server1_db2').then((mongoUri) => {
  connections.conn2.connect(mongoUri, mongooseOpts);
  addEvents(connections.conn2, mongoUri);
});

mongoServer2.getConnectionString('server2_db').then((mongoUri) => {
  connections.conn3.connect(mongoUri, mongooseOpts);
  addEvents(connections.conn3, mongoUri);
});

export default connections;


// somewhere in other file
import { Schema } from 'mongoose';
import { conn1, conn2, conn3 } from './file_above';

const userSchema = new Schema({
  name: String,
});

const taskSchema = new Schema({
  userId: String,
  task: String,
});

export default {
  User: conn1.model('user', userSchema),
  Task: conn2.model('task', taskSchema),
  UserOnServer2: conn3.model('user', userSchema),
}
```

### Simple Mocha test example
```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

before(function(done) {
  const mongoServer = new MongodbMemoryServer();
  mongoServer.getConnectionString().then((mongoUri) => {
    mongoose.connect(mongoUri, function(err) {
      done(err);
    });
  });
});

describe('...', function() {
    it("...", function() {
      // ...
    });
});

```


## Credits
Inspired by alternative runners for [mongodb-prebuilt](https://github.com/winfinit/mongodb-prebuilt):
- [mockgoose](https://github.com/mockgoose/Mockgoose)
- [mongomem](https://github.com/CImrie/mongomem)

## License

MIT
