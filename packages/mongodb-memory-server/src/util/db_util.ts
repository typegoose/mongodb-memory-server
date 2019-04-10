import uuid from 'uuid/v4';

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

export default generateDbName;
