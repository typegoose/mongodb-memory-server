import { Db, MongoClient } from 'mongodb';
import MongoMemoryServer, { MongoInstanceDataT } from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
let con: MongoClient;
let db: Db;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  con = await MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = con.db(await mongoServer.getDbName());
});

afterAll(async () => {
  if (con) con.close();
  if (mongoServer) await mongoServer.stop();
});

describe('Single mongoServer', () => {
  it('should start mongo server', async () => {
    expect(db).toBeDefined();
    const col = db.collection('test');
    const result = await col.insertMany([{ a: 1 }, { b: 1 }]);
    expect(result.result).toMatchSnapshot();
    expect(await col.countDocuments({})).toBe(2);
  });

  it('should get URI of specified DB name', async () => {
    const port: number = await mongoServer.getPort();
    expect(await mongoServer.getUri('dumb')).toBe(`mongodb://127.0.0.1:${port}/dumb?`);
  });

  it('should throw error on start if there is already a running instance', async () => {
    const mongoServer2 = new MongoMemoryServer({ autoStart: false });
    mongoServer2.runningInstance = Promise.resolve({}) as Promise<MongoInstanceDataT>;
    await expect(mongoServer2.start()).rejects.toThrow(
      'MongoDB instance already in status startup/running/error. Use opts.debug = true for more info.'
    );
  });
});
