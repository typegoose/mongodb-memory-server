/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from '../index';
import { assertion, isNullOrUndefined, uuidv4 } from '../util/utils';

// This is an Example test, do not merge it with others and do not delete this file

describe('Restart single MongoMemoryServer instance', () => {
  it('should insert documents, stop, restart and still have everything (wiredTiger)', async () => {
    jest.spyOn(MongoMemoryServer.prototype, 'start');
    jest.spyOn(MongoMemoryServer.prototype, 'stop');
    jest.spyOn(MongoMemoryServer.prototype, 'cleanup');

    const instance = await MongoMemoryServer.create({ instance: { storageEngine: 'wiredTiger' } });

    const databaseName = uuidv4();
    const collectionName = uuidv4();
    let insertedDoc: Record<string, any>;
    // first connect and insert
    {
      const connection = await MongoClient.connect(instance.getUri(), {});
      const db = connection.db(databaseName);

      expect(db).toBeDefined();
      const collection = db.collection(collectionName);

      const result = await collection.insertOne({ hello: 'there', doc: 1 });

      const doc = await collection.findOne({ _id: result.insertedId });
      assertion(!isNullOrUndefined(doc));
      insertedDoc = doc;

      await connection.close();
    }

    await instance.stop({ doCleanup: false, force: false });
    expect(MongoMemoryServer.prototype.cleanup).not.toHaveBeenCalled();

    // there is no need to wait here, because a single instance does not need to be forced to the same port
    await instance.start();

    // second connect and check
    {
      const connection = await MongoClient.connect(instance.getUri(), {});
      const db = connection.db(databaseName);

      expect(db).toBeDefined();
      const collection = db.collection(collectionName);

      const result = await collection.findOne({});
      const collectionCount = await collection.countDocuments({});

      expect(collectionCount).toStrictEqual(1);
      expect(result).toStrictEqual(insertedDoc);

      await connection.close();
    }

    await instance.stop();

    expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(2);
    expect(MongoMemoryServer.prototype.stop).toHaveBeenCalledTimes(2);
    expect(MongoMemoryServer.prototype.cleanup).toHaveBeenCalledTimes(1);
  });
});
