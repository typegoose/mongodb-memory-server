/// <reference types='node' />

import { ChildProcess } from 'child_process';
import { MongoBinaryOpts } from './MongoBinary';

export interface MongodOps {
    // instance options
    instance: {
        port: number;
        storageEngine?: string;
        dbPath: string;
        debug?: boolean | ((...args: any[]) => any);
    };

    // mongo binary options
    binary?: MongoBinaryOpts;

    // child process spawn options
    spawn?: {
        cwd?: string;
        env?: object;
        argv0?: string;
        stdio?: string | any[];
        detached?: boolean;
        uid?: number;
        gid?: number;
        shell?: boolean | string;
    };

    debug?: boolean | ((...args: any[]) => any);
}

export default class MongodbInstance {
    static childProcessList: ChildProcess[];

    opts: MongodOps;
    debug: ((...args: any[]) => any);
    childProcess: ChildProcess;
    killerProcess: ChildProcess;
    instanceReady: ((...args: any[]) => any);
    instanceFailed: ((...args: any[]) => any);

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

    private _launchMongod(mongoBin: string): ChildProcess;
    private _launchKiller(parentPid: number, childPid: number): ChildProcess;
}
