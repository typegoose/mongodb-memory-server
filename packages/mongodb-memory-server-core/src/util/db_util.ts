import { v4 as uuidv4 } from 'uuid';

/**
 * Returns a database name string.
 * @param {string} dbName
 */
export function generateDbName(dbName?: string): string {
  return dbName || uuidv4();
}

/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
export function getHost(uri: string): string {
  return uri.replace('mongodb://', '').replace(/\/.*/, '');
}

/**
 * Basic MongoDB Connection string
 */
export function getUriBase(host: string, port: number, dbName: string): string {
  return `mongodb://${host}:${port}/${dbName}?`;
}

/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
export function isNullOrUndefined(val: unknown): val is null | undefined {
  return val === null || val === undefined;
}

/**
 * Assert an condition, if "false" throw error
 * Note: it is not named "assert" to differentiate between node and jest types
 * @param cond The Condition to throw
 * @param error An Custom Error to throw
 */
export function assertion(cond: unknown, error?: Error): asserts cond {
  if (!cond) {
    throw error ?? new Error('Assert failed - no custom error [E019]');
  }
}

export default generateDbName;
