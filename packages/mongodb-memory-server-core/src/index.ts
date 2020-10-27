import './util/resolveConfig'; // import it for the side-effects (globals)
import { MongoMemoryServer } from './MongoMemoryServer';

export { MongoBinary } from './util/MongoBinary';
export { MongoInstance } from './util/MongoInstance';
export { MongoMemoryReplSet } from './MongoMemoryReplSet';

export { MongoMemoryServer };
export default MongoMemoryServer;
