import * as os from 'os';
import { MongoClientOptions } from 'mongodb';
import { assertion } from '../../util/utils';

/**
 * This function is just here because "expect(err).toBeInstanceOf(Error)" does not use "asserts", and so stays "unknown" which makes typescript error
 * Use this function after any "toBeInstanceOf" calls!
 * @param value The Value to Assert to error
 */
export function assertIsError(value: unknown): asserts value is Error {
  assertion(value instanceof Error, new Error('Expected "value" to be instanceof Error!'));
}

/**
 * Options for every test "MongoClient", because the driver's dynamic import of "os" fails in jest
 * @see https://jira.mongodb.org/browse/NODE-7832
 */
export const clientOpts: MongoClientOptions = { runtimeAdapters: { os } };
