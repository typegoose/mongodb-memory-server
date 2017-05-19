/* @flow */

import { MongodHelper } from 'mongodb-prebuilt';
import uuid from 'uuid/v4';
import tmp from 'tmp';
import getport from 'get-port';

tmp.setGracefulCleanup();

export type MongoMemoryServerOptsT = {
  port?: number,
  storageEngine?: string,
  dbPath?: string,
  autoStart?: boolean,
  debug?: boolean,
};

export type MongoInstanceDataT = {
  port: number,
  dbPath: string,
  uri: string,
  storageEngine: string,
  mongodCli: MongodHelper,
};

async function generateConnectionString(port: string, dbName: ?string): Promise<string> {
  const db = dbName || (await uuid());
  return `mongodb://localhost:${port}/${db}`;
}

export default class MongoDBMemoryServer {
  debug: boolean = false;
  isRunning: boolean = false;
  runningInstance: ?Promise<MongoInstanceDataT>;
  opts: MongoMemoryServerOptsT;

  constructor(opts?: MongoMemoryServerOptsT = {}) {
    this.opts = opts;

    // autoStart by default
    if (!opts.hasOwnProperty('autoStart') || opts.autoStart) {
      if (opts.debug) {
        console.log('Autostarting MongoDB instance...');
      }
      this.start();
    }
  }

  async start(): Promise<boolean> {
    if (this.runningInstance) {
      throw new Error(
        'MongoDB instance already in status startup/running/error. Use opts.debug = true for more info.'
      );
    }

    this.runningInstance = Promise.resolve().then(async () => {
      const data = {};
      let tmpDir;

      data.port = await getport(this.opts.port);
      data.uri = await generateConnectionString(data.port);
      data.storageEngine = this.opts.storageEngine || 'ephemeralForTest';
      if (this.opts.dbPath) {
        data.dbPath = this.opts.dbPath;
      } else {
        tmpDir = tmp.dirSync({ prefix: 'mongo-mem-', unsafeCleanup: true });
        data.dbPath = tmpDir.name;
      }

      if (this.opts.debug) {
        console.log(`Starting MongoDB instance with following options: ${JSON.stringify(data)}`);
      }

      const mongodCli = new MongodHelper([
        '--port',
        data.port,
        '--storageEngine',
        data.storageEngine,
        '--dbpath',
        data.dbPath,
        '--noauth',
      ]);

      mongodCli.debug.enabled = this.opts.debug;

      // Download if not exists mongo binaries in ~/.mongodb-prebuilt
      // After that startup MongoDB instance
      await mongodCli.run().catch(err => {
        if (!this.opts.debug) {
          throw new Error(
            `${err.message}\n\nUse debug option for more info: new MongoMemoryServer({ debug: true })`
          );
        }
        throw err;
      });

      data.mongodCli = mongodCli;
      data.tmpDir = tmpDir;

      return data;
    });

    return this.runningInstance.then(() => true);
  }

  async stop(): Promise<boolean> {
    const { mongodCli, port, tmpDir } = await this.getInstanceData();

    if (mongodCli && mongodCli.mongoBin.childProcess) {
      // .mongoBin.childProcess.connected
      if (this.opts.debug) {
        console.log(
          `Shutdown MongoDB server on port ${port} with pid ${mongodCli.mongoBin.childProcess.pid}`
        );
      }
      mongodCli.mongoBin.childProcess.kill();
    }

    if (tmpDir) {
      if (this.opts.debug) {
        console.log(`Removing tmpDir ${tmpDir.name}`);
      }
      tmpDir.removeCallback();
    }

    this.runningInstance = null;
    return true;
  }

  async getInstanceData(): Promise<MongoInstanceDataT> {
    if (this.runningInstance) {
      return this.runningInstance;
    }
    throw new Error(
      'Database instance is not running. You should start database by calling start() method. BTW it should start automatically if opts.autoStart!=false. Also you may provide opts.debug=true for more info.'
    );
  }

  async getUri(otherDbName?: string | boolean = false): Promise<string> {
    const { uri, port } = await this.getInstanceData();

    // IF true OR string
    if (otherDbName) {
      if (typeof otherDbName === 'string') {
        // generate uri with provided DB name on existed DB instance
        return generateConnectionString(port, otherDbName);
      }
      // generate new random db name
      return generateConnectionString(port);
    }

    return uri;
  }

  async getConnectionString(otherDbName: string | boolean = false): Promise<string> {
    return this.getUri(otherDbName);
  }

  async getPort(): Promise<number> {
    const { port } = await this.getInstanceData();
    return port;
  }

  async getDbPath(): Promise<string> {
    const { port } = await this.getInstanceData();
    return port;
  }
}
