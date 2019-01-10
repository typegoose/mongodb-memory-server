/// <reference types='node' />

import { ChildProcess, SpawnOptions } from 'child_process';
import { MongoBinaryOpts } from './MongoBinary';
import { DebugFn, DebugPropT, CallbackFn, StorageEngineT } from '../types';

export interface MongodOps {
    // instance options
    instance: {
        port: number;
        storageEngine?: StorageEngineT;
        dbPath: string;
        debug?: DebugPropT;
        replSet?: string;
        args?: string[];
        auth?: boolean;
    };

    // mongo binary options
    binary?: MongoBinaryOpts;

    // child process spawn options
    spawn?: SpawnOptions;

    debug?: DebugPropT;
}

export default class MongodbInstance {
    static childProcessList: ChildProcess[];

    opts: MongodOps;
    debug: DebugFn;
    childProcess: ChildProcess;
    killerProcess: ChildProcess;
    instanceReady: CallbackFn;
    instanceFailed: CallbackFn;
    isInstanceReady: boolean;

    constructor(opts: MongodOps);

    static run(opts: MongodOps): Promise<MongodbInstance>;
    prepareCommandArgs(): string[];
    run(): Promise<MongodbInstance>;
    kill(): Promise<MongodbInstance>;
    getPid(): number | undefined;
    errorHandler(err: string): void;
    closeHandler(code: number): void;
    stderrHandler(message: string | Buffer): void;
    stdoutHandler(message: string | Buffer): void;
}
