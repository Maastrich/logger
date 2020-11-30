declare type ToFile = {
    toFile: Function;
};
/**
 *
 *
 * @class Logger
 */
declare class Logger {
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private path;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private debugColor;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private defaultColor;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private errorColor;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private infoColor;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private fromDebug;
    /**
     *
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private fromError;
    /**
     * Creates an instance of Logger.
     * @param {string} logFolder
     * @memberof Logger
     */
    constructor(logFolder: string);
    /**
     *
     *
     * @param {string} where
     * @param {(string | string[])} what
     * @param {boolean} [fatal]
     * @return {ToFile}
     * @memberof Logger
     */
    error(where: string, what: string | string[], fatal?: boolean): ToFile;
    /**
     *
     *
     * @param {string} where
     * @param {*} data
     * @return {ToFile}
     * @memberof Logger
     */
    debug(where: string, data: any): ToFile;
    /**
     *
     *
     * @param {(string | string[])} what
     * @return {ToFile}
     * @memberof Logger
     */
    info(what: string | string[]): ToFile;
    /**
     *
     *
     * @memberof Logger
     */
    saveLogs(): void;
    /**
     *
     *
     * @memberof Logger
     */
    waitForClose(): void;
}
export { Logger };
export default Logger;
