import { MongoClient } from 'mongodb';
import MongoMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('Single mongoServer', () => {
  let con: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    con = await MongoClient.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    if (con) {
      await con.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('should start mongo server', async () => {
    const db = con.db(mongoServer.getDbName());

    expect(db).toBeDefined();
    const col = db.collection('test');
    const result = await col.insertMany([{ a: 1 }, { b: 1 }]);
    expect(result.result).toMatchSnapshot();
    expect(await col.countDocuments({})).toBe(2);
  });

  it('should throw error on start if there is already a running instance', async () => {
    const mongoServer2 = new MongoMemoryServer();
    // this case can normally happen if "start" is called again
    mongoServer2.instanceInfo = {} as any; // artificially set this to {} to not be undefined anymore
    await expect(mongoServer2.start()).rejects.toThrow(
      'MongoDB instance already in status startup/running/error. Use debug for more info.'
    );
  });
});
