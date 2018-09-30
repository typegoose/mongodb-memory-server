import { ReplStatusResultT } from '../types';
/**
 * Returns a database name string.
 * @param {string} dbName
 */
export function generateDbName(dbName?: string): string;

/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
export function getHost(uri: string): string;

/**
 * Returns replica set status result.
 * @param {any} db db instance
 */
export function getReplStatus(db: any): Promise<ReplStatusResultT>;

export default generateDbName;
