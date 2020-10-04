import './util/resolve-config'; // import it for the side-effects (globals)

export { MongoBinary } from './util/MongoBinary';
export { MongoInstance } from './util/MongoInstance';
export { MongoMemoryServer } from './MongoMemoryServer';
export { MongoMemoryReplSet } from './MongoMemoryReplSet';

export default MongoMemoryServer;
