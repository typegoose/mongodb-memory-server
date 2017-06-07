/* @flow */

import { MongoClient } from 'mongodb';
import MongoDBMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

let db;
let mongoServer;
beforeAll(async () => {
  mongoServer = new MongoDBMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  db = await MongoClient.connect(mongoUri);
});

afterAll(() => {
  db.close();
  mongoServer.stop();
});

describe('Single mongoServer', () => {
  it('should start mongo server', async () => {
    const col = db.collection('test');
    const result = await col.insert([{ a: 1 }, { b: 1 }]);
    expect(result.result).toMatchSnapshot();
    expect(await col.count({})).toBe(2);
  });
});
