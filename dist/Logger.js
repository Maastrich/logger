"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var fs_1 = __importDefault(require("fs"));
var stringify_object_1 = __importDefault(require("stringify-object"));
var readline_1 = __importDefault(require("readline"));
var path_1 = __importDefault(require("path"));
/**
 *
 *
 * @class Logger
 */
var Logger = /** @class */ (function () {
    /**
     * Creates an instance of Logger.
     * @param {string} logFolder
     * @memberof Logger
     */
    function Logger(logFolder) {
        if (logFolder === void 0) { logFolder = ''; }
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof Logger
         */
        this.debugColor = '\u001b[33m';
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof Logger
         */
        this.defaultColor = '\u001b[0m';
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof Logger
         */
        this.errorColor = '\u001b[38;5;208m';
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof Logger
         */
        this.infoColor = '\u001b[35m';
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof Logger
         */
        this.fromDebug = '\u001b[34m';
        /**
         *
         *
         * @private
         * @type {string}
         * @memberof Logger
         */
        this.fromError = '\u001b[31m';
        this.path = path_1.default.normalize(logFolder);
        if (logFolder.length) {
            if (!fs_1.default.existsSync(this.path)) {
                fs_1.default.mkdirSync(this.path);
            }
            fs_1.default.unlink(this.path + "error.log", function () { });
            fs_1.default.unlink(this.path + "debug.log", function () { });
            fs_1.default.unlink(this.path + "info.log", function () { });
        }
        this.waitForClose();
    }
    /**
     *
     *
     * @param {string} where
     * @param {(string | string[])} what
     * @param {boolean} [fatal]
     * @return {ToFile}
     * @memberof Logger
     */
    Logger.prototype.error = function (where, what, fatal) {
        var _this = this;
        if (typeof what === 'string') {
            process.stderr.write(this.fromError + "[" + where + "]" + this.errorColor + "\t-> " + what + "\n\n" + this.defaultColor);
            if (fatal) {
                fs_1.default.appendFile(this.path + "error.log", "[" + new Date().toString() + "] " + ("" + what) + "\n", function (err) {
                    if (err)
                        throw new Error("Unable to log error: " + err);
                });
                process.exit(1);
            }
        }
        else {
            var str = "\t-> " + what.join('\n\t-> ');
            process.stderr.write(this.fromError + "[" + where + "]" + this.errorColor + "\n" + ("" + str) + "\n" + this.defaultColor);
            if (fatal) {
                fs_1.default.appendFile(this.path + "error.log", "[" + new Date().toString() + "]\n[" + where + "]\t" + what + "\n\n", function (err) {
                    if (err)
                        throw new Error("Unable to log error: " + err);
                });
                process.exit(1);
            }
        }
        return {
            toFile: function () {
                if (typeof what === 'string') {
                    fs_1.default.appendFile(_this.path + "error.log", "[" + new Date().toString() + "] " + ("" + what) + "\n", function (err) {
                        if (err)
                            throw new Error("Unable to log error: " + err);
                    });
                }
                else {
                    var str = "\t-> " + what.join('\n\t-> ');
                    fs_1.default.appendFile(_this.path + "error.log", "[" + new Date().toString() + "]\n[" + where + "]\t" + str + "\n\n", function (err) {
                        if (err)
                            throw new Error("Unable to log error: " + err);
                    });
                }
            },
        };
    };
    /**
     *
     *
     * @param {string} where
     * @param {*} data
     * @return {ToFile}
     * @memberof Logger
     */
    Logger.prototype.debug = function (where, data) {
        var _this = this;
        process.stdout.write(this.fromDebug + "From:\t" + where + "\n" + this.debugColor + (stringify_object_1.default(data)).replace(/^/gm, '\t') + "\n\n" + this.defaultColor);
        return {
            toFile: function () {
                fs_1.default.appendFile(_this.path + "debug.log", "[" + new Date().toString() + "]\nFrom:\n\t" + where + "\nWith:\n\t" + stringify_object_1.default(data) + "\n\n", function (err) {
                    if (err)
                        throw new Error("Unable to log debug: " + err);
                });
            },
        };
    };
    /**
     *
     *
     * @param {(string | string[])} what
     * @return {ToFile}
     * @memberof Logger
     */
    Logger.prototype.info = function (what) {
        var _this = this;
        if (typeof what === 'string') {
            process.stdout.write(this.infoColor + "Info:\t-> " + ("" + what) + "\n" + this.defaultColor);
        }
        else {
            var str = "\t-> " + what.join('\n\t-> ');
            process.stdout.write(this.infoColor + "Info:" + ("" + str) + "\n" + this.defaultColor);
        }
        return {
            toFile: function () {
                if (typeof what === 'string') {
                    fs_1.default.appendFile(_this.path + "info.log", "[" + new Date().toString() + "] " + ("" + what) + "\n", function (err) {
                        if (err)
                            throw new Error("Unable to log info: " + err);
                    });
                }
                else {
                    var str = "\t-> " + what.join('\n\t-> ');
                    fs_1.default.appendFile(_this.path + "info.log", "[" + new Date().toString() + "]\n" + ("" + str) + "\n", function (err) {
                        if (err)
                            throw new Error("Unable to log info: " + err);
                    });
                }
            },
        };
    };
    /**
     *
     *
     * @memberof Logger
     */
    Logger.prototype.saveLogs = function () {
        var date = new Date();
        process.stdout.write("Saving logs...\n\tDate: " + date.toString() + "\n\tLocation: " + this.path + "previous-logs/" + date.toISOString() + "\n");
        if (!fs_1.default.existsSync(this.path + "previous-logs")) {
            fs_1.default.mkdirSync(this.path + "previous-logs");
        }
        if (!fs_1.default.existsSync(this.path + "previous-logs/" + date.toISOString())) {
            fs_1.default.mkdirSync(this.path + "previous-logs/" + date.toISOString());
        }
        fs_1.default.rename(this.path + "error.log", this.path + "previous-logs/" + date.toISOString() + "/error.log", function (err) {
            if (!err) {
                process.stdout.write('\t\t- error.log\n');
            }
        });
        fs_1.default.rename(this.path + "debug.log", this.path + "previous-logs/" + date.toISOString() + "/debug.log", function (err) {
            if (!err) {
                process.stdout.write('\t\t- debug.log\n');
            }
        });
        fs_1.default.rename(this.path + "info.log", this.path + "previous-logs/" + date.toISOString() + "/info.log", function (err) {
            if (!err) {
                process.stdout.write('\t\t- info.log\n');
            }
        });
        fs_1.default.writeFile(this.path + "previous-logs/" + date.toISOString() + "/date", "Logs saved on " + date.toString(), function (err) {
            if (!err) {
                process.stdout.write('\t\t- date (Contain the date where the logs have been saved in a human readable format)\n\n');
            }
        });
    };
    /**
     *
     *
     * @memberof Logger
     */
    Logger.prototype.waitForClose = function () {
        var _this = this;
        var rl = readline_1.default.createInterface({
            input: process.stdin,
        });
        rl.question('', function (answer) {
            if (answer === 'Save Logs' || answer === 'sl') {
                _this.saveLogs();
            }
            rl.close();
            _this.waitForClose();
        });
    };
    return Logger;
}());
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=Logger.js.map