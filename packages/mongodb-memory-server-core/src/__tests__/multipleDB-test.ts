/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import MongoMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('Multiple mongoServers', () => {
  let con1: MongoClient;
  let con2: MongoClient;
  let mongoServer1: MongoMemoryServer;
  let mongoServer2: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer1 = await MongoMemoryServer.create();
    con1 = await MongoClient.connect(mongoServer1.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoServer2 = await MongoMemoryServer.create();
    con2 = await MongoClient.connect(mongoServer2.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    if (con1) {
      await con1.close();
    }
    if (con2) {
      await con2.close();
    }
    if (mongoServer1) {
      await mongoServer1.stop();
    }
    if (mongoServer2) {
      await mongoServer2.stop();
    }
  });

  it('should start several servers', async () => {
    const db1 = con1.db(mongoServer1.instanceInfo!.dbName);
    const db2 = con2.db(mongoServer1.instanceInfo!.dbName);

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

  it('should have different uri', () => {
    const uri1 = mongoServer1.getUri();
    const uri2 = mongoServer2.getUri();
    expect(uri1).not.toEqual(uri2);
  });

  it('v6.0.0 adds "?" to the connection string (uri)', () => {
    const uri1 = mongoServer1.getUri();
    expect(uri1.includes('?')).toBeTruthy();
  });
});
