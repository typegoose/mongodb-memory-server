import './util/resolveConfig.js'; // import it for the side-effects (globals)
import { MongoMemoryServer } from './MongoMemoryServer.js';

export { MongoBinary } from './util/MongoBinary.js';
export { MongoInstance } from './util/MongoInstance.js';
export { MongoMemoryReplSet } from './MongoMemoryReplSet.js';

export { MongoMemoryServer };
export default MongoMemoryServer;
