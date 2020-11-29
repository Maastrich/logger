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
var Logger = /** @class */ (function () {
    function Logger(logFolder) {
        this.debugColor = '\u001b[33m';
        this.defaultColor = '\u001b[0m';
        this.errorColor = '\u001b[38;5;208m';
        this.infoColor = '\u001b[35m';
        this.fromDebug = '\u001b[34m';
        this.fromError = '\u001b[31m';
        this.path = path_1.default.normalize(logFolder);
        if (!fs_1.default.existsSync(this.path)) {
            fs_1.default.mkdirSync(this.path);
        }
        fs_1.default.unlink(this.path + "error.log", function () { });
        fs_1.default.unlink(this.path + "debug.log", function () { });
        fs_1.default.unlink(this.path + "info.log", function () { });
        this.waitForClose();
    }
    Logger.prototype.error = function (where, what, fatal) {
        if (typeof what === 'string') {
            fs_1.default.appendFile(this.path + "error.log", "[" + new Date().toString() + "] " + ("" + what) + "\n", function (err) {
                if (err)
                    throw new Error("Unable to log error: " + err);
            });
            process.stderr.write(this.fromError + "[" + where + "]" + this.errorColor + "\t-> " + what + "\n\n" + this.defaultColor);
            if (fatal) {
                process.exit(1);
            }
        }
        else {
            var str = "\t-> " + what.join('\t-> ');
            fs_1.default.appendFile(this.path + "error.log", "[" + new Date().toString() + "]\n[" + where + "]\t" + what + "\n\n", function (err) {
                if (err)
                    throw new Error("Unable to log error: " + err);
            });
            process.stderr.write(this.fromError + "[" + where + "]" + this.errorColor + "\n" + ("" + str) + "\n" + this.defaultColor);
            if (fatal) {
                process.exit(1);
            }
        }
    };
    Logger.prototype.debug = function (where, data) {
        fs_1.default.appendFile(this.path + "debug.log", "[" + new Date().toString() + "]\nFrom:\n\t" + where + "\nWith:\n\t" + stringify_object_1.default(data) + "\n\n", function (err) {
            if (err)
                throw new Error("Unable to log debug: " + err);
        });
        process.stdout.write(this.fromDebug + "From:\t" + where + "\n" + this.debugColor + (stringify_object_1.default(data)).replace(/^/gm, '\t') + "\n\n" + this.defaultColor);
    };
    Logger.prototype.info = function (what) {
        if (typeof what === 'string') {
            fs_1.default.appendFile(this.path + "info.log", "[" + new Date().toString() + "] " + ("" + what) + "\n", function (err) {
                if (err)
                    throw new Error("Unable to log info: " + err);
            });
            process.stdout.write(this.infoColor + "Info:\t-> " + ("" + what) + "\n" + this.defaultColor);
        }
        else {
            var str_1 = '';
            what.map(function (line) { str_1 += "\t-> " + line + "\n"; return true; });
            fs_1.default.appendFile(this.path + "info.log", "[" + new Date().toString() + "]\n" + ("" + str_1) + "\n", function (err) {
                if (err)
                    throw new Error("Unable to log info: " + err);
            });
            process.stdout.write(this.infoColor + "Info:" + ("" + str_1) + "\n" + this.defaultColor);
        }
    };
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