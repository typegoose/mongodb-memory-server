/* @flow */

import { MongoClient } from 'mongodb';
import MongoDBMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let con1;
let con2;
let db1;
let db2;
let mongoServer1;
let mongoServer2;
beforeAll(async () => {
  mongoServer1 = new MongoDBMemoryServer();
  const mongoUri = await mongoServer1.getConnectionString();
  con1 = await MongoClient.connect(mongoUri);
  db1 = con1.db(await mongoServer1.getDbName());

  mongoServer2 = new MongoDBMemoryServer();
  const mongoUri2 = await mongoServer2.getConnectionString();
  con2 = await MongoClient.connect(mongoUri2);
  db2 = con2.db(await mongoServer1.getDbName());
});

afterAll(() => {
  con1.close();
  con2.close();
  mongoServer1.stop();
  mongoServer2.stop();
});

describe('Multiple mongoServers', () => {
  it('should start several servers', async () => {
    expect(db1).toBeDefined();
    const col1 = db1.collection('test');
    const result1 = await col1.insert([{ a: 1 }, { b: 1 }]);
    expect(result1.result).toMatchSnapshot();
    expect(await col1.count({})).toBe(2);

    expect(db2).toBeDefined();
    const col2 = db2.collection('test');
    const result2 = await col2.insert([{ a: 2 }, { b: 2 }]);
    expect(result2.result).toMatchSnapshot();
    expect(await col2.count({})).toBe(2);
  });

  it('should have different uri', async () => {
    const uri1 = await mongoServer1.getConnectionString();
    const uri2 = await mongoServer2.getConnectionString();

    expect(uri1).not.toEqual(uri2);
  });
});
