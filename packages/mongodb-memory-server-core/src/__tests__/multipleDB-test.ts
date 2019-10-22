import { Db, MongoClient } from 'mongodb';
import MongoMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let con1: MongoClient;
let con2: MongoClient;
let db1: Db;
let db2: Db;
let mongoServer1: MongoMemoryServer;
let mongoServer2: MongoMemoryServer;

beforeAll(async () => {
  mongoServer1 = new MongoMemoryServer();
  const mongoUri = await mongoServer1.getConnectionString();
  con1 = await MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db1 = con1.db(await mongoServer1.getDbName());

  mongoServer2 = new MongoMemoryServer();
  const mongoUri2 = await mongoServer2.getConnectionString();
  con2 = await MongoClient.connect(mongoUri2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db2 = con2.db(await mongoServer1.getDbName());
});

afterAll(async () => {
  if (con1) con1.close();
  if (con2) con2.close();
  if (mongoServer1) await mongoServer1.stop();
  if (mongoServer2) await mongoServer2.stop();
});

describe('Multiple mongoServers', () => {
  it('should start several servers', async () => {
    expect(db1).toBeDefined();
    const col1 = db1.collection('test');
    const result1 = await col1.insertMany([{ a: 1 }, { b: 1 }]);
    expect(result1.result).toMatchSnapshot();
    expect(await col1.countDocuments({})).toBe(2);

    expect(db2).toBeDefined();
    const col2 = db2.collection('test');
    const result2 = await col2.insertMany([{ a: 2 }, { b: 2 }]);
    expect(result2.result).toMatchSnapshot();
    expect(await col2.countDocuments({})).toBe(2);
  });

  it('should have different uri', async () => {
    const uri1 = await mongoServer1.getConnectionString();
    const uri2 = await mongoServer2.getConnectionString();
    expect(uri1).not.toEqual(uri2);
  });

  it('v6.0.0 adds "?" to the connection string (uri)', async () => {
    const uri1 = await mongoServer1.getConnectionString();
    expect(uri1.includes('?')).toBeTruthy();
  });
});
