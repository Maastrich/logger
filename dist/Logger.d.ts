declare class Logger {
    private path;
    private debugColor;
    private defaultColor;
    private errorColor;
    private infoColor;
    private fromDebug;
    private fromError;
    constructor(logFolder: string);
    error(where: string, what: string | string[], fatal?: boolean): void;
    debug(where: string, data: any): void;
    info(what: string | string[]): void;
    saveLogs(): void;
    waitForClose(): void;
}
export { Logger };
export default Logger;
