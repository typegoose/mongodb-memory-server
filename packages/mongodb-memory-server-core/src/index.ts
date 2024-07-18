import './util/resolveConfig'; // import it for the side-effects (globals)
import { MongoMemoryServer } from './MongoMemoryServer';

export { DryMongoBinary } from './util/DryMongoBinary';
export { MongoBinary } from './util/MongoBinary';
export { MongoInstance } from './util/MongoInstance';
export { MongoMemoryReplSet } from './MongoMemoryReplSet';
export * as errors from './util/errors';

export { MongoMemoryServer };
export default MongoMemoryServer;
