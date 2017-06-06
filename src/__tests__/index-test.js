/* @flow */

import MongoDBMemoryServer from '../index';
import { MongoClient } from 'mongodb';

describe('MongoDBMemoryServer', () => {
  it('should start mongo server', async () => {
    const server = new MongoDBMemoryServer();
    const mongoUri = await server.getConnectionString();
    const db = await MongoClient.connect(mongoUri);
    const col = db.collection('test');

    const result = await col.insert([{ a: 1 }, { b: 1 }]);
    expect(result.result).toMatchSnapshot();
    expect(await col.count({})).toBe(2);
  });

  it('should start several servers', async () => {
    const server1 = new MongoDBMemoryServer();
    const mongoUri1 = await server1.getConnectionString();
    const db1 = await MongoClient.connect(mongoUri1);
    const col1 = db1.collection('test');

    const server2 = new MongoDBMemoryServer();
    const mongoUri2 = await server2.getConnectionString();
    const db2 = await MongoClient.connect(mongoUri2);
    const col2 = db2.collection('test');

    expect(mongoUri1).not.toEqual(mongoUri2);

    const result1 = await col1.insert([{ a: 1 }, { b: 1 }]);
    expect(result1.result).toMatchSnapshot();
    expect(await col1.count({})).toBe(2);

    const result2 = await col2.insert([{ a: 2 }, { b: 2 }]);
    expect(result2.result).toMatchSnapshot();
    expect(await col2.count({})).toBe(2);
  });
});
