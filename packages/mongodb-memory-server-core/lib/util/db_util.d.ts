import { ReplStatusResultT } from '../types';
import { Db } from 'mongodb';
/**
 * Returns a database name string.
 * @param {string} dbName
 */
export declare function generateDbName(dbName?: string): string;
/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
export declare function getHost(uri: string): string;
/**
 * Returns replica set status result.
 * @param {any} db db instance
 */
export declare function getReplStatus(db: Db): Promise<ReplStatusResultT>;
export default generateDbName;
//# sourceMappingURL=db_util.d.ts.map