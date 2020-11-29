import fs from 'fs';
import ObjectLog from 'stringify-object';
import readline from 'readline';
import path from 'path';

class Logger {
    private path: string;

    private debugColor: string = '\u001b[33m';

    private defaultColor: string = '\u001b[0m';

    private errorColor: string = '\u001b[38;5;208m';

    private infoColor: string = '\u001b[35m';

    private fromDebug: string = '\u001b[34m';

    private fromError: string = '\u001b[31m';

    constructor(logFolder: string) {
        this.path = path.normalize(logFolder);
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
        fs.unlink(`${this.path}error.log`, () => { });
        fs.unlink(`${this.path}debug.log`, () => { });
        fs.unlink(`${this.path}info.log`, () => { });
        this.waitForClose();
    }

    public error(where: string, what: string | string[], fatal?: boolean) {
        if (typeof what === 'string') {
            fs.appendFile(`${this.path}error.log`, `[${new Date().toString()}] ${`${what}`}\n`, (err) => {
                if (err) throw new Error(`Unable to log error: ${err}`);
            });
            process.stderr.write(`${this.fromError}[${where}]${this.errorColor}\t-> ${what}\n\n${this.defaultColor}`);
            if (fatal) {
                process.exit(1);
            }
        } else {
            const str = `\t-> ${what.join('\t-> ')}`;
            fs.appendFile(`${this.path}error.log`, `[${new Date().toString()}]\n[${where}]\t${what}\n\n`, (err) => {
                if (err) throw new Error(`Unable to log error: ${err}`);
            });
            process.stderr.write(`${this.fromError}[${where}]${this.errorColor}\n${`${str}`}\n${this.defaultColor}`);
            if (fatal) {
                process.exit(1);
            }
        }
    }

    public debug(where: string, data: any): void {
        fs.appendFile(`${this.path}debug.log`, `[${new Date().toString()}]\nFrom:\n\t${where}\nWith:\n\t${ObjectLog(data)}\n\n`, (err) => {
            if (err) throw new Error(`Unable to log debug: ${err}`);
        });
        process.stdout.write(`${this.fromDebug}From:\t${where}\n${this.debugColor}${(ObjectLog(data)).replace(/^/gm, '\t')}\n\n${this.defaultColor}`);
    }

    public info(what: string | string[]): void {
        if (typeof what === 'string') {
            fs.appendFile(`${this.path}info.log`, `[${new Date().toString()}] ${`${what}`}\n`, (err) => {
                if (err) throw new Error(`Unable to log info: ${err}`);
            });
            process.stdout.write(`${this.infoColor}Info:\t-> ${`${what}`}\n${this.defaultColor}`);
        } else {
            let str = '';
            what.map((line: string) => { str += `\t-> ${line}\n`; return true; });
            fs.appendFile(`${this.path}info.log`, `[${new Date().toString()}]\n${`${str}`}\n`, (err) => {
                if (err) throw new Error(`Unable to log info: ${err}`);
            });
            process.stdout.write(`${this.infoColor}Info:${`${str}`}\n${this.defaultColor}`);
        }
    }

    public saveLogs() {
        const date = new Date();
        process.stdout.write(`Saving logs...\n\tDate: ${date.toString()}\n\tLocation: ${this.path}previous-logs/${date.toISOString()}\n`);
        if (!fs.existsSync(`${this.path}previous-logs`)) {
            fs.mkdirSync(`${this.path}previous-logs`);
        }
        if (!fs.existsSync(`${this.path}previous-logs/${date.toISOString()}`)) {
            fs.mkdirSync(`${this.path}previous-logs/${date.toISOString()}`);
        }
        fs.rename(`${this.path}error.log`, `${this.path}previous-logs/${date.toISOString()}/error.log`, (err) => {
            if (!err) {
                process.stdout.write('\t\t- error.log\n');
            }
        });
        fs.rename(`${this.path}debug.log`, `${this.path}previous-logs/${date.toISOString()}/debug.log`, (err) => {
            if (!err) {
                process.stdout.write('\t\t- debug.log\n');
            }
        });
        fs.rename(`${this.path}info.log`, `${this.path}previous-logs/${date.toISOString()}/info.log`, (err) => {
            if (!err) {
                process.stdout.write('\t\t- info.log\n');
            }
        });
        fs.writeFile(`${this.path}previous-logs/${date.toISOString()}/date`, `Logs saved on ${date.toString()}`, (err) => {
            if (!err) { process.stdout.write('\t\t- date (Contain the date where the logs have been saved in a human readable format)\n\n'); }
        });
    }

    public waitForClose() {
        const rl: readline.Interface = readline.createInterface({
            input: process.stdin,
        });
        rl.question('', (answer) => {
            if (answer === 'Save Logs' || answer === 'sl') {
                this.saveLogs();
            }
            rl.close();
            this.waitForClose();
        });
    }
}

export { Logger };
export default Logger;
