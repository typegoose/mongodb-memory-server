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
export function getUriBase(host: string, port: number, dbName: string) {
  return `mongodb://${host}:${port}/${dbName}?`;
}

export default generateDbName;
