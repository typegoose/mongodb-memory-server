export declare class StateError extends Error {
    wantedStates: string[];
    gotState: string;
    constructor(wantedStates: string[], gotState: string);
}
export declare class UnknownLockfileStatusError extends Error {
    status: number;
    constructor(status: number);
}
export declare class UnableToUnlockLockfileError extends Error {
    thisInstance: boolean;
    file: string;
    constructor(thisInstance: boolean, file: string);
}
export declare class UnknownPlatformError extends Error {
    platform: string;
    constructor(platform: string);
}
export declare class UnknownArchitectureError extends Error {
    arch: string;
    platform?: string | undefined;
    constructor(arch: string, platform?: string | undefined);
}
export declare class WaitForPrimaryTimeoutError extends Error {
    timeout: number;
    where?: string | undefined;
    constructor(timeout: number, where?: string | undefined);
}
export declare class Md5CheckFailedError extends Error {
    binarymd5: string;
    checkfilemd5: string;
    constructor(binarymd5: string, checkfilemd5: string);
}
export declare class StartBinaryFailedError extends Error {
    binary: string;
    constructor(binary: string);
}
export declare class InstanceInfoError extends Error {
    where: string;
    constructor(where: string);
}
export declare class KeyFileMissingError extends Error {
    constructor();
}
export declare class AuthNotObjectError extends Error {
    constructor();
}
export declare class InsufficientPermissionsError extends Error {
    path: string;
    constructor(path: string);
}
export declare class BinaryNotFoundError extends Error {
    path: string;
    extra: string;
    constructor(path: string, extra?: string);
}
/**
 * Custom Fallback Error for "utils.assertion", it is a named/custom Error to confuse less in the stacktrace
 */
export declare class AssertionFallbackError extends Error {
    constructor();
}
export declare class ReplsetCountLowError extends Error {
    count: number;
    constructor(count: number);
}
export declare class ParseArchiveRegexError extends Error {
    key: string;
    constructor(key: string);
}
export declare class NoRegexMatchError extends Error {
    name: string;
    extra?: string | undefined;
    constructor(name: string, extra?: string | undefined);
}
export declare class KnownVersionIncompatibilityError extends Error {
    dist: string;
    requested_version: string;
    available_versions: string;
    extra?: string | undefined;
    constructor(dist: string, requested_version: string, available_versions: string, extra?: string | undefined);
}
/**
 * Basic Error wrapper for "instanceError" events from "stdoutHandler"
 */
export declare class StdoutInstanceError extends Error {
    constructor(msg: string);
}
/**
 * Error for when the instance closes with non-0 (or non-12) codes or signals
 */
export declare class UnexpectedCloseError extends Error {
    constructor(code: number | null, signal: string | null);
}
/**
 * Error for when VERSION fails to coerce to a semver version but is required
 */
export declare class UnknownVersionError extends Error {
    version: string;
    constructor(version: string);
}
/**
 * Error for when downloading fails
 */
export declare class DownloadError extends Error {
    url: string;
    msg: string;
    constructor(url: string, msg: string);
}
/**
 * Error for when the linux distro is unknown
 */
export declare class UnknownLinuxDistro extends Error {
    distro: string;
    id_like: string[];
    constructor(distro: string, id_like: string[]);
}
export declare class GenericMMSError extends Error {
}
//# sourceMappingURL=errors.d.ts.map