// @flow
import uuid from 'uuid/v4';
import type { ReplStatusResultT } from '../types';
/**
 * Returns a database name string.
 * @param {string} dbName
 */
export function generateDbName(dbName?: string): string {
  return dbName || uuid();
}

/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
export function getHost(uri: string): string {
  return uri.replace('mongodb://', '').replace(/\/.*/, '');
}

/**
 * Returns replica set status result.
 * @param {any} db db instance
 */
export async function getReplStatus(db: any): Promise<ReplStatusResultT> {
  const status = await db.command({ replSetGetStatus: 1 });
  return status;
}

export default generateDbName;
