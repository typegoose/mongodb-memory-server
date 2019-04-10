/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { MongoBinaryOpts } from './MongoBinary';
import { DebugPropT, StorageEngineT, SpawnOptions } from '../types';
export interface MongodOps {
    instance: {
        port?: number;
        ip?: string;
        storageEngine?: StorageEngineT;
        dbPath?: string;
        debug?: DebugPropT;
        replSet?: string;
        args?: string[];
        auth?: boolean;
    };
    binary?: MongoBinaryOpts;
    spawn?: SpawnOptions;
    debug?: DebugPropT;
}
export default class MongoInstance {
    static childProcessList: ChildProcess[];
    opts: MongodOps;
    debug: Function;
    childProcess: ChildProcess | null;
    killerProcess: ChildProcess | null;
    instanceReady: Function;
    instanceFailed: Function;
    isInstanceReady: boolean;
    constructor(opts: MongodOps);
    static run(opts: MongodOps): Promise<MongoInstance>;
    prepareCommandArgs(): string[];
    run(): Promise<MongoInstance>;
    kill(): Promise<MongoInstance>;
    getPid(): number | undefined;
    _launchMongod(mongoBin: string): ChildProcess;
    _launchKiller(parentPid: number, childPid: number): ChildProcess;
    errorHandler(err: string): void;
    closeHandler(code: number): void;
    stderrHandler(message: string | Buffer): void;
    stdoutHandler(message: string | Buffer): void;
}
//# sourceMappingURL=MongoInstance.d.ts.map