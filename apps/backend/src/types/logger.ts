export interface Logger {
    log(message: string, opts?: unknown): void;

    error(message: string, opts?: unknown): void;

    warn(message: string, opts?: unknown): void;

    info(message: string, opts?: unknown): void;

    debug(message: string, opts?: unknown): void;
}